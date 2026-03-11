import type { VercelRequest, VercelResponse } from '@vercel/node';

const REMOTIVE_BASE = 'https://remotive.com/api/remote-jobs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const category = typeof req.query.category === 'string' ? req.query.category : '';
    const limit = typeof req.query.limit === 'string' ? req.query.limit : '50';

    const params = new URLSearchParams({ limit });
    if (category) params.set('category', category);

    try {
        const response = await fetch(`${REMOTIVE_BASE}?${params.toString()}`);

        if (!response.ok) {
            const text = await response.text();
            return res.status(response.status).json({ error: text });
        }

        const data = await response.json();

        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
        return res.status(200).json(data);
    } catch (error: any) {
        console.error('Remotive proxy error:', error);
        return res.status(502).json({ error: 'Failed to fetch from Remotive' });
    }
}
