import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        // Fetch from a service that returns our IP
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();

        return res.status(200).json({
            vercelIP: data.ip,
            message: 'Add this IP to your Clash of Clans API key'
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
