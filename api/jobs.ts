import type { VercelRequest, VercelResponse } from '@vercel/node';

const SERPAPI_BASE = 'https://serpapi.com/search.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const q = req.query.q;
    if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Missing "q" query parameter' });
    }

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'SerpApi key not configured on server' });
    }

    const params = new URLSearchParams({
        engine: 'google_jobs',
        q,
        api_key: apiKey,
    });

    try {
        const response = await fetch(`${SERPAPI_BASE}?${params.toString()}`);

        if (!response.ok) {
            const text = await response.text();
            return res.status(response.status).json({ error: text });
        }

        const data = await response.json();

        // Cache on CDN for 24 hours, allow stale for 1 hour
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
        return res.status(200).json(data);
    } catch (error: any) {
        console.error('SerpApi proxy error:', error);
        return res.status(502).json({ error: 'Failed to fetch from SerpApi' });
    }
}
