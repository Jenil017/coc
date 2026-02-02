import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Extract the API path from query params
    const { path } = req.query;

    if (!path || typeof path !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid "path" query parameter' });
    }

    // Get API token from environment
    const token = process.env.COC_API_TOKEN;
    if (!token) {
        return res.status(500).json({ error: 'COC_API_TOKEN not configured' });
    }

    // Construct the full Clash of Clans API URL
    const apiUrl = `https://api.clashofclans.com/v1/${path}`;

    try {
        // Proxy the request to Clash of Clans API
        const response = await fetch(apiUrl, {
            method: req.method || 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        // Get response data
        const data = await response.json();

        // Return with same status code
        return res.status(response.status).json(data);
    } catch (error: any) {
        console.error('[CoC API Proxy Error]:', error);
        return res.status(500).json({
            error: 'Failed to fetch from Clash of Clans API',
            message: error.message
        });
    }
}
