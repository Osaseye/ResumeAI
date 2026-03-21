import type { VercelRequest, VercelResponse } from '@vercel/node';

const ADZUNA_BASE = 'https://api.adzuna.com/v1/api/jobs/gb/search/1';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const appId = process.env.ADZUNA_APP_ID || 'e3da6427';
    const appKey = process.env.ADZUNA_APP_KEY || '32704d6227e4696cc1e6e6d8135b5fc6';

    if (!appId || !appKey) {
        return res.status(200).json({ use_fallback: true });
    }

    const query = typeof req.query.what === 'string' ? req.query.what : '';
    const results_per_page = typeof req.query.results_per_page === 'string' ? req.query.results_per_page : '20';

    const params = new URLSearchParams({
        app_id: appId,
        app_key: appKey,
        results_per_page,
    });
    
    if (query) params.set('what', query);

    try {
        const response = await fetch(`${ADZUNA_BASE}?${params.toString()}`);

        if (response.status === 429) {
            return res.status(200).json({ use_fallback: true });
        }

        if (!response.ok) {
            const text = await response.text();
            console.error('Adzuna error:', text);
            return res.status(200).json({ use_fallback: true });
        }

        const data = await response.json();

        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
        return res.status(200).json(data);
    } catch (error: any) {
        console.error('Adzuna proxy error:', error);
        return res.status(200).json({ use_fallback: true });
    }
}
