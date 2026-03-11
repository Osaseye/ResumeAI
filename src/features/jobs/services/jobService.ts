// SerpApi (Google Jobs engine) via Vercel serverless proxy.
// Per-device daily rate limiting. Cached per-query for 24 hours.

export interface Job {
    job_id: string;
    employer_name: string;
    employer_logo?: string;
    job_title: string;
    job_city: string;
    job_country: string;
    job_is_remote: boolean;
    job_posted_at_timestamp: number;
    job_description: string;
    job_apply_link: string;
    job_min_salary?: number;
    job_max_salary?: number;
    job_salary_currency?: string;
    match_score?: number;
}

const DEVICE_CALL_KEY = 'device_job_api_date';
const PRIMARY_JOBS_KEY = 'primary_jobs_cache';

/** Returns today's date as YYYY-MM-DD string for comparison */
function getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
}

/** Check whether this device has already made an API call today */
function hasDeviceCalledToday(): boolean {
    const lastCallDate = localStorage.getItem(DEVICE_CALL_KEY);
    return lastCallDate === getTodayDateString();
}

/** Record that this device made an API call today */
function recordDeviceCall(): void {
    localStorage.setItem(DEVICE_CALL_KEY, getTodayDateString());
}

/** Try to find cached results for a specific query (valid for 24h) */
function getCachedJobs(cacheKey: string): Job[] | null {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    try {
        const { timestamp, jobs } = JSON.parse(cached);
        const oneDay = 24 * 60 * 60 * 1000;
        if (Date.now() - timestamp < oneDay) {
            return jobs;
        }
    } catch {
        localStorage.removeItem(cacheKey);
    }
    return null;
}

/** Search all query caches and return the most recent valid results */
function getAnyCachedJobs(): Job[] | null {
    const prefix = 'job_search_';
    const oneDay = 24 * 60 * 60 * 1000;
    let best: { jobs: Job[]; timestamp: number } | null = null;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(prefix)) continue;

        try {
            const parsed = JSON.parse(localStorage.getItem(key)!);
            if (
                parsed?.jobs?.length &&
                Date.now() - parsed.timestamp < oneDay &&
                (!best || parsed.timestamp > best.timestamp)
            ) {
                best = parsed;
            }
        } catch {
            // Ignore malformed cache entries
        }
    }

    return best?.jobs ?? null;
}

/** Map a SerpApi Google Jobs result item to our Job interface */
function mapSerpApiItem(item: any, index: number): Job {
    const extensions = item.detected_extensions || {};
    const applyLink = item.apply_options?.[0]?.link
        || item.share_link
        || item.related_links?.[0]?.link
        || '';

    // Parse salary from extensions
    let minSalary: number | undefined;
    let maxSalary: number | undefined;
    let currency: string | undefined;

    if (extensions.salary) {
        const salaryStr: string = extensions.salary;
        const nums = salaryStr.replace(/,/g, '').match(/[\d.]+/g);
        if (nums && nums.length >= 2) {
            minSalary = parseFloat(nums[0]);
            maxSalary = parseFloat(nums[1]);
            if (salaryStr.toLowerCase().includes('k')) {
                minSalary *= 1000;
                maxSalary *= 1000;
            }
        } else if (nums && nums.length === 1) {
            minSalary = parseFloat(nums[0]);
            if (salaryStr.toLowerCase().includes('k')) minSalary *= 1000;
        }
        currency = salaryStr.startsWith('₦') ? 'NGN'
            : salaryStr.startsWith('$') ? 'USD'
            : salaryStr.startsWith('€') ? 'EUR'
            : salaryStr.startsWith('£') ? 'GBP'
            : undefined;
    }

    const location = item.location || '';
    const isRemote = /remote/i.test(location)
        || /remote/i.test(extensions.schedule_type || '')
        || /remote/i.test(item.title || '');

    const locParts = location.split(',').map((s: string) => s.trim());
    const city = locParts[0] || '';
    const country = locParts[1] || (location.toLowerCase().includes('nigeria') ? 'Nigeria' : '');

    return {
        job_id: item.job_id || `serp_${index}_${Date.now()}`,
        employer_name: item.company_name || 'Unknown Company',
        employer_logo: item.thumbnail || undefined,
        job_title: item.title || 'Untitled Position',
        job_city: city,
        job_country: country,
        job_is_remote: isRemote,
        job_posted_at_timestamp: extensions.posted_at
            ? Date.now() - parseSerpApiAge(extensions.posted_at)
            : Date.now(),
        job_description: item.description || '',
        job_apply_link: applyLink,
        job_min_salary: minSalary,
        job_max_salary: maxSalary,
        job_salary_currency: currency,
        match_score: Math.floor(Math.random() * 20 + 80),
    };
}

/** Convert SerpApi age strings like "3 days ago" to milliseconds */
function parseSerpApiAge(ageStr: string): number {
    const num = parseInt(ageStr) || 1;
    if (/hour/i.test(ageStr)) return num * 60 * 60 * 1000;
    if (/day/i.test(ageStr)) return num * 24 * 60 * 60 * 1000;
    if (/week/i.test(ageStr)) return num * 7 * 24 * 60 * 60 * 1000;
    if (/month/i.test(ageStr)) return num * 30 * 24 * 60 * 60 * 1000;
    return 24 * 60 * 60 * 1000;
}

export const jobsService = {
    async searchJobs(query: string, location: string = 'Nigeria'): Promise<Job[]> {
        const cacheKey = `job_search_${query}_${location}`;

        // 1. Return cached results if still valid
        const cached = getCachedJobs(cacheKey);
        if (cached) {
            console.log(`Serving cached jobs for "${query}" in ${location}`);
            return cached;
        }

        // 2. Check per-device daily limit
        if (hasDeviceCalledToday()) {
            console.log('Device API call already used today. Returning cached results.');
            return getAnyCachedJobs() ?? [];
        }

        // 3. Call our Vercel serverless proxy (avoids CORS, keeps key server-side)
        console.log(`Fetching jobs for "${query}" in ${location} via proxy...`);

        const params = new URLSearchParams({
            q: `${query} in ${location}`,
        });

        try {
            const response = await fetch(`/api/jobs?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Job API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.jobs_results || !Array.isArray(data.jobs_results) || data.jobs_results.length === 0) {
                console.warn('No jobs found for this query.');
                recordDeviceCall();
                return [];
            }

            const jobs: Job[] = data.jobs_results.slice(0, 10).map(mapSerpApiItem);

            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), jobs }));
            recordDeviceCall();

            return jobs;
        } catch (error) {
            console.error('Error searching jobs:', error);
            return getAnyCachedJobs() ?? [];
        }
    },

    /**
     * Called once at onboarding. Makes the device's daily API call,
     * stores ~10 jobs as the primary set that feeds the entire app.
     */
    async fetchAndStoreJobs(role: string, location: string = 'Nigeria'): Promise<Job[]> {
        const jobs = await this.searchJobs(role, location);
        if (jobs.length > 0) {
            localStorage.setItem(
                PRIMARY_JOBS_KEY,
                JSON.stringify({ timestamp: Date.now(), jobs })
            );
        }
        return jobs;
    },

    /**
     * Read-only access to the primary job set. No API call.
     * Used by Dashboard, Resume Details, Job Board, etc.
     */
    getStoredJobs(): Job[] {
        const raw = localStorage.getItem(PRIMARY_JOBS_KEY);
        if (!raw) return getAnyCachedJobs() ?? [];

        try {
            const { timestamp, jobs } = JSON.parse(raw);
            const oneDay = 24 * 60 * 60 * 1000;
            if (Date.now() - timestamp < oneDay && jobs?.length) {
                return jobs;
            }
        } catch {
            localStorage.removeItem(PRIMARY_JOBS_KEY);
        }
        return getAnyCachedJobs() ?? [];
    },

    async getJobDetails(jobId: string): Promise<Job | null> {
        // SerpApi Google Jobs doesn't have a dedicated job-details endpoint,
        // so we look up from cached search results only.
        return findJobInCache(jobId);
    },
};

/** Search all cached query results for a specific job by ID */
function findJobInCache(jobId: string): Job | null {
    const prefix = 'job_search_';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(prefix)) continue;

        try {
            const { jobs } = JSON.parse(localStorage.getItem(key)!);
            const found = jobs?.find((j: Job) => j.job_id === jobId);
            if (found) return found;
        } catch {
            // skip
        }
    }
    return null;
}
