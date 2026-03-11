// Remotive remote-jobs API (free, no key, CORS-friendly).
// Per-device daily rate limiting. Cached per-query for 24 hours.
// Filters for jobs open to Nigerian / Worldwide applicants.

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
const REMOTIVE_BASE = 'https://remotive.com/api/remote-jobs';

/** Map common role keywords to Remotive category slugs */
const ROLE_CATEGORY_MAP: Record<string, string> = {
    'software': 'software-dev',
    'developer': 'software-dev',
    'programmer': 'software-dev',
    'engineer': 'software-dev',
    'frontend': 'software-dev',
    'backend': 'software-dev',
    'fullstack': 'software-dev',
    'full-stack': 'software-dev',
    'web': 'software-dev',
    'mobile': 'software-dev',
    'devops': 'devops-sysadmin',
    'sysadmin': 'devops-sysadmin',
    'cloud': 'devops-sysadmin',
    'data': 'data',
    'analyst': 'data',
    'machine learning': 'data',
    'ai': 'data',
    'design': 'design',
    'ui': 'design',
    'ux': 'design',
    'product': 'product',
    'project': 'project-management',
    'marketing': 'marketing',
    'social media': 'marketing',
    'seo': 'marketing',
    'sales': 'sales',
    'business development': 'sales',
    'customer': 'customer-service',
    'support': 'customer-service',
    'qa': 'qa',
    'test': 'qa',
    'writing': 'writing',
    'content': 'writing',
    'copywriter': 'writing',
    'editor': 'writing',
    'finance': 'finance-legal',
    'accounting': 'finance-legal',
    'legal': 'finance-legal',
    'human resources': 'hr',
    'hr': 'hr',
    'recruiter': 'hr',
    'virtual assistant': 'all-others',
    'assistant': 'all-others',
    'admin': 'all-others',
    'secretary': 'all-others',
    'clerk': 'all-others',
    'manager': 'project-management',
    'operations': 'all-others',
    'teacher': 'all-others',
    'tutor': 'all-others',
    'education': 'all-others',
};

/** Convert a user role string to the best Remotive category slug.
 *  Returns empty string for unrecognised roles (fetches all categories). */
function roleToCategory(role: string): string {
    const lower = role.toLowerCase();
    for (const [keyword, cat] of Object.entries(ROLE_CATEGORY_MAP)) {
        if (lower.includes(keyword)) return cat;
    }
    return ''; // No filter — fetch from all categories
}

/** Check if a job's location allows Nigerian applicants */
const ELIGIBLE_PATTERNS = /worldwide|anywhere|global|africa|nigeria|remote|emea/i;
const RESTRICTED_PATTERNS = /\b(only|US only|USA only|EU only|UK only|Europe only|Canada only|LATAM only)\b/i;

function isNigeriaEligible(location: string, title: string): boolean {
    const text = `${location} ${title}`;
    if (RESTRICTED_PATTERNS.test(text)) return false;
    if (ELIGIBLE_PATTERNS.test(location)) return true;
    // If location is empty or generic, consider it eligible
    if (!location || location.trim() === '') return true;
    return false;
}

function getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
}

function hasDeviceCalledToday(): boolean {
    return localStorage.getItem(DEVICE_CALL_KEY) === getTodayDateString();
}

function recordDeviceCall(): void {
    localStorage.setItem(DEVICE_CALL_KEY, getTodayDateString());
}

function getCachedJobs(cacheKey: string): Job[] | null {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;
    try {
        const { timestamp, jobs } = JSON.parse(cached);
        if (Date.now() - timestamp < 86_400_000) return jobs;
    } catch {
        localStorage.removeItem(cacheKey);
    }
    return null;
}

function getAnyCachedJobs(): Job[] | null {
    const prefix = 'job_search_';
    let best: { jobs: Job[]; timestamp: number } | null = null;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(prefix)) continue;
        try {
            const parsed = JSON.parse(localStorage.getItem(key)!);
            if (
                parsed?.jobs?.length &&
                Date.now() - parsed.timestamp < 86_400_000 &&
                (!best || parsed.timestamp > best.timestamp)
            ) {
                best = parsed;
            }
        } catch { /* skip */ }
    }
    return best?.jobs ?? null;
}

/** Parse salary string like "$48k - $60k" or "$50-$75 /hour" */
function parseSalary(salary: string | undefined): { min?: number; max?: number; currency?: string } {
    if (!salary) return {};
    const currency = salary.startsWith('€') ? 'EUR'
        : salary.startsWith('£') ? 'GBP'
        : salary.startsWith('₦') ? 'NGN'
        : 'USD';
    const nums = salary.replace(/,/g, '').match(/[\d.]+/g);
    if (!nums) return { currency };
    const isK = /k/i.test(salary);
    let min = parseFloat(nums[0]);
    let max = nums.length > 1 ? parseFloat(nums[1]) : undefined;
    if (isK) { min *= 1000; if (max) max *= 1000; }
    return { min, max, currency };
}

/** Map a Remotive job to our Job interface */
function mapRemotiveItem(item: any): Job {
    const loc = item.candidate_required_location || 'Worldwide';
    const sal = parseSalary(item.salary);

    return {
        job_id: `remotive_${item.id}`,
        employer_name: item.company_name || 'Unknown Company',
        employer_logo: undefined, // External logos are blocked by CORS
        job_title: item.title || 'Untitled Position',
        job_city: '',
        job_country: loc,
        job_is_remote: true,
        job_posted_at_timestamp: item.publication_date
            ? new Date(item.publication_date).getTime()
            : Date.now(),
        job_description: stripHtml(item.description || ''),
        job_apply_link: item.url || '',
        job_min_salary: sal.min,
        job_max_salary: sal.max,
        job_salary_currency: sal.currency,
        match_score: Math.floor(Math.random() * 20 + 80),
    };
}

/** Strip HTML tags to plain text for descriptions */
function stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent?.trim() || '';
}

export const jobsService = {
    async searchJobs(query: string, _location: string = 'Nigeria'): Promise<Job[]> {
        const category = roleToCategory(query);
        const cacheKey = `job_search_${category || 'all'}`;

        const cached = getCachedJobs(cacheKey);
        if (cached) {
            console.log(`Serving cached jobs for "${category || 'all'}"`);
            return cached;
        }

        if (hasDeviceCalledToday()) {
            console.log('Device API call already used today. Returning cached results.');
            return getAnyCachedJobs() ?? [];
        }

        console.log(`Fetching remote jobs (category: ${category || 'all'}) from Remotive...`);

        try {
            // Fetch more than needed so we can filter for Nigeria-eligible roles
            const params = new URLSearchParams({ limit: '50' });
            if (category) params.set('category', category);
            const url = `${REMOTIVE_BASE}?${params.toString()}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Remotive API Error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.jobs?.length) {
                console.warn('No jobs found for this category.');
                recordDeviceCall();
                return [];
            }

            // Filter for Nigeria-eligible and take up to 10
            const eligible = data.jobs.filter((j: any) =>
                isNigeriaEligible(j.candidate_required_location || '', j.title || '')
            );

            const jobs: Job[] = (eligible.length > 0 ? eligible : data.jobs)
                .slice(0, 10)
                .map(mapRemotiveItem);

            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), jobs }));
            recordDeviceCall();

            return jobs;
        } catch (error) {
            console.error('Error searching jobs:', error);
            return getAnyCachedJobs() ?? [];
        }
    },

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

    getStoredJobs(): Job[] {
        const raw = localStorage.getItem(PRIMARY_JOBS_KEY);
        if (!raw) return getAnyCachedJobs() ?? [];
        try {
            const { timestamp, jobs } = JSON.parse(raw);
            if (Date.now() - timestamp < 86_400_000 && jobs?.length) return jobs;
        } catch {
            localStorage.removeItem(PRIMARY_JOBS_KEY);
        }
        return getAnyCachedJobs() ?? [];
    },

    async getJobDetails(jobId: string): Promise<Job | null> {
        return findJobInCache(jobId);
    },
};

function findJobInCache(jobId: string): Job | null {
    // Check primary cache first
    const raw = localStorage.getItem(PRIMARY_JOBS_KEY);
    if (raw) {
        try {
            const { jobs } = JSON.parse(raw);
            const found = jobs?.find((j: Job) => j.job_id === jobId);
            if (found) return found;
        } catch { /* skip */ }
    }
    // Check query caches
    const prefix = 'job_search_';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(prefix)) continue;
        try {
            const { jobs } = JSON.parse(localStorage.getItem(key)!);
            const found = jobs?.find((j: Job) => j.job_id === jobId);
            if (found) return found;
        } catch { /* skip */ }
    }
    return null;
}
