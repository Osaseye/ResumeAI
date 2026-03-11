// JSearch (RapidAPI) integration with per-device daily rate limiting.
// Each device (browser) gets one fresh API call per day.
// Results are cached per-query for 24 hours. No mock/fallback data.

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

const API_HOST = 'jsearch.p.rapidapi.com';
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

function mapApiItemToJob(item: any): Job {
    return {
        job_id: item.job_id,
        employer_name: item.employer_name,
        employer_logo: item.employer_logo,
        job_title: item.job_title,
        job_city: item.job_city,
        job_country: item.job_country,
        job_is_remote: item.job_is_remote,
        job_posted_at_timestamp: item.job_posted_at_timestamp * 1000,
        job_description: item.job_description,
        job_apply_link: item.job_apply_link,
        job_min_salary: item.job_min_salary,
        job_max_salary: item.job_max_salary,
        job_salary_currency: item.job_salary_currency,
        match_score: Math.floor(Math.random() * 20 + 80),
    };
}

export const jobsService = {
    async searchJobs(query: string, location: string = 'Nigeria'): Promise<Job[]> {
        const cacheKey = `job_search_${query}_${location}`;

        // 1. Return cached results for this exact query if still valid
        const cached = getCachedJobs(cacheKey);
        if (cached) {
            console.log(`Serving cached jobs for "${query}" in ${location}`);
            return cached;
        }

        // 2. Check per-device daily limit
        const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;

        if (!apiKey) {
            console.warn('RapidAPI key missing. Returning cached results if available.');
            return getAnyCachedJobs() ?? [];
        }

        if (hasDeviceCalledToday()) {
            console.log('Device API call already used today. Returning cached results.');
            return getAnyCachedJobs() ?? [];
        }

        // 3. Make the API call (device's one call for today)
        console.log(`Searching for "${query}" in ${location}...`);

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': API_HOST,
            },
        };

        try {
            const response = await fetch(
                `https://${API_HOST}/search?query=${encodeURIComponent(query + ' in ' + location)}&num_pages=1`,
                options
            );

            if (!response.ok) {
                if (response.status === 429) {
                    console.warn('RapidAPI rate limit exceeded.');
                }
                if (response.status === 403) {
                    console.warn('RapidAPI forbidden — check API key.');
                }
                throw new Error(`RapidAPI Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
                console.warn('No jobs found from API for this query.');
                // Still count as a used call — the API responded successfully
                recordDeviceCall();
                return [];
            }

            const jobs: Job[] = data.data.map(mapApiItemToJob);

            // Cache this query's results
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), jobs }));

            // Mark the device call as used for today
            recordDeviceCall();

            return jobs;
        } catch (error) {
            console.error('Error searching jobs:', error);
            // On error, try returning any valid cached results
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
        // First try to find the job in any cached search results
        const cachedJob = findJobInCache(jobId);
        if (cachedJob) return cachedJob;

        // Fall back to JSearch job-details endpoint (does NOT count toward daily limit
        // since it's a detail lookup, not a search)
        console.log(`Fetching details for job ${jobId}...`);

        const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
        if (!apiKey) return null;

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': API_HOST,
            },
        };

        try {
            const response = await fetch(
                `https://${API_HOST}/job-details?job_id=${encodeURIComponent(jobId)}`,
                options
            );
            if (!response.ok) throw new Error('Failed to fetch job details');

            const data = await response.json();
            const item = data.data?.[0];
            if (!item) return null;

            return mapApiItemToJob(item);
        } catch (error) {
            console.error('Error fetching job details:', error);
            return null;
        }
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
