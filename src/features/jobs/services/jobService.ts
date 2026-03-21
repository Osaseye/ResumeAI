import { storage } from '@/utils/storage';

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

const PRIMARY_JOBS_KEY = 'primary_jobs_cache';

const NIGERIAN_CURATED_JOBS: Job[] = [
    {
        job_id: 'curated_1',
        employer_name: 'Paystack',
        job_title: 'Senior Frontend Engineer',
        job_city: 'Lagos',
        job_country: 'Nigeria',
        job_is_remote: true,
        job_posted_at_timestamp: Date.now() - 86400000,
        job_description: 'Join our team to build scalable payment experiences for African merchants.',
        job_apply_link: 'https://paystack.com/careers',
        job_min_salary: 8000000,
        job_max_salary: 15000000,
        job_salary_currency: 'NGN'
    },
    {
        job_id: 'curated_2',
        employer_name: 'Flutterwave',
        job_title: 'Backend Developer',
        job_city: 'Lagos',
        job_country: 'Nigeria',
        job_is_remote: true,
        job_posted_at_timestamp: Date.now() - 172800000,
        job_description: 'Design and build the APIs that power money transfer across borders.',
        job_apply_link: 'https://flutterwave.com/us/careers',
        job_min_salary: 10000000,
        job_max_salary: 18000000,
        job_salary_currency: 'NGN'
    },
    {
        job_id: 'curated_3',
        employer_name: 'Kuda Bank',
        job_title: 'Product Manager',
        job_city: 'Lagos',
        job_country: 'Nigeria',
        job_is_remote: false,
        job_posted_at_timestamp: Date.now() - 259200000,
        job_description: 'Lead the continuous improvement of the bank of the free.',
        job_apply_link: 'https://kuda.com/careers',
        job_min_salary: 6000000,
        job_max_salary: 12000000,
        job_salary_currency: 'NGN'
    }
];

function getCachedJobs(cacheKey: string): Job[] | null {
    const cached = storage.getItem(cacheKey);
    if (!cached) return null;
    try {
        const { timestamp, jobs } = JSON.parse(cached);
        if (Date.now() - timestamp < 86_400_000) return jobs;
    } catch {
        storage.removeItem(cacheKey);
    }
    return null;
}

function getAnyCachedJobs(): Job[] | null {
    const prefix = 'job_search_';
    let best: { jobs: Job[]; timestamp: number } | null = null;
    
    for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (!key || !key.startsWith(prefix) || !storage.isKeyForCurrentUser(key)) continue;
        try {
            const parsed = JSON.parse(storage.getRawItem(key)!);
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

function _getFallback(role: string): Job[] {
    const fallbackJobs = [...NIGERIAN_CURATED_JOBS];
    const roleLower = role.toLowerCase();
    
    return fallbackJobs.sort((a, b) => {
        const aMatches = a.job_title.toLowerCase().includes(roleLower) ? 1 : 0;
        const bMatches = b.job_title.toLowerCase().includes(roleLower) ? 1 : 0;
        return bMatches - aMatches;
    });
}

function mapAdzunaItem(item: any): Job {
    const title = item.title || '';
    const desc = item.description || '';
    const location = item.location?.display_name || '';
    const area = item.location?.area || [];
    
    const isRemote = /remote|work from home/i.test(title + ' ' + desc + ' ' + location);
    
    let city = '';
    if (area.length >= 2) {
        city = area[area.length - 1]; // Sometimes the most specific is last
    }

    let companyName = item.company?.display_name || 'Confidential Employer';
    // Clean up weird Adzuna scraping artifacts
    if (companyName.toLowerCase().includes('apartment') || companyName.toLowerCase() === 'unknown') {
        companyName = 'Confidential Employer';
    }

    return {
        job_id: `adzuna_${item.id}`,
        employer_name: companyName,
        employer_logo: undefined,
        job_title: title.replace(/<[^>]*>?/gm, ''),
        job_city: city || 'Remote',
        job_country: item.location?.display_name?.includes('South Africa') ? 'South Africa' : (area[0] || 'International'),
        job_is_remote: isRemote,
        job_posted_at_timestamp: item.created ? new Date(item.created).getTime() : Date.now(),
        job_description: desc.replace(/<[^>]*>?/gm, ''),
        job_apply_link: item.redirect_url || '',
        job_min_salary: item.salary_min,
        job_max_salary: item.salary_max,
        job_salary_currency: 'NGN',
        match_score: Math.abs((title.length * 7) % 20) + 80,
    };
}

export const jobsService = {
    async searchJobs(query: string, _location: string = 'Nigeria'): Promise<Job[]> {
        console.log(`[JobService] searchJobs called with query: "${query}"`);
        const cacheKey = `job_search_${query.toLowerCase()}`;
        
        const cached = getCachedJobs(cacheKey);
        if (cached) {
            console.log(`[JobService] Returning from cache for key: ${cacheKey}`);
            return cached;
        }
        
        try {
            const params = new URLSearchParams({ results_per_page: '20' });
            if (query) params.set('what', query);
            
            console.log(`[JobService] Fetching from /api/jobs...`);
            const response = await fetch(`/api/jobs?${params.toString()}`);
            console.log(`[JobService] Proxy response status:`, response.status);

            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            
            const data = await response.json();
            console.log(`[JobService] Proxy data received:`, data);
            
            if (data.use_fallback || !data.results || data.results.length === 0) {
                console.log(`[JobService] Fallback flagged or 0 results. Checking getAnyCachedJobs()`);
                const anyCached = getAnyCachedJobs();
                if (anyCached) {
                    console.log(`[JobService] Found previously cached jobs to use as fallback.`);
                    return anyCached;
                }
                console.log(`[JobService] Using NIGERIAN_CURATED_JOBS fallback array.`);
                return _getFallback(query);
            }
            
            const jobs = data.results.map(mapAdzunaItem);
            console.log(`[JobService] Successfully mapped ${jobs.length} jobs from Adzuna.`);
            storage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), jobs }));
            return jobs;
            
        } catch (error) {
            console.error('[JobService] Job search API failed:', error);
            const anyCached = getAnyCachedJobs();
            if (anyCached) return anyCached;
            return _getFallback(query);
        }
    },

    async fetchAndStoreJobs(role: string, location: string = 'Nigeria'): Promise<Job[]> {
        console.log(`[JobService] fetchAndStoreJobs called for role: "${role}"`);
        const jobs = await this.searchJobs(role, location);
        if (jobs.length > 0) {
            storage.setItem(
                PRIMARY_JOBS_KEY,
                JSON.stringify({ timestamp: Date.now(), jobs })
            );
        }
        return jobs;
    },

    getStoredJobs(): Job[] {
        const raw = storage.getItem(PRIMARY_JOBS_KEY);
        console.log(`[JobService] getStoredJobs called. Found cache?`, Boolean(raw));
        if (!raw) return getAnyCachedJobs() ?? _getFallback('');
        try {
            const { timestamp, jobs } = JSON.parse(raw);
            if (Date.now() - timestamp < 86_400_000 && jobs?.length) return jobs;
        } catch {
            storage.removeItem(PRIMARY_JOBS_KEY);
        }
        return getAnyCachedJobs() ?? _getFallback('');
    },

    async getJobDetails(jobId: string): Promise<Job | null> {
        // Check primary cache first
        const raw = storage.getItem(PRIMARY_JOBS_KEY);
        if (raw) {
            try {
                const { jobs } = JSON.parse(raw);
                const found = jobs?.find((j: Job) => j.job_id === jobId);
                if (found) return found;
            } catch { /* skip */ }
        }
        // Check query caches
        const prefix = 'job_search_';
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (!key || !key.startsWith(prefix) || !storage.isKeyForCurrentUser(key)) continue;
            try {
                const { jobs } = JSON.parse(storage.getRawItem(key)!);
                const found = jobs?.find((j: Job) => j.job_id === jobId);
                if (found) return found;
            } catch { /* skip */ }
        }
        
        // Check fallbacks
        const fallbackJob = NIGERIAN_CURATED_JOBS.find(j => j.job_id === jobId);
        if (fallbackJob) return fallbackJob;
        
        return null;
    },
};
