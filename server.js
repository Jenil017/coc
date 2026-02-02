import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Routes
// Check IP endpoint
app.get('/api/check-ip', async (req, res) => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();

        return res.status(200).json({
            vercelIP: data.ip,
            message: 'Add this IP to your Clash of Clans API key'
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// CoC API proxy endpoint
app.get('/api/coc/', async (req, res) => {
    const { path: apiPath } = req.query;

    if (!apiPath || typeof apiPath !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid "path" query parameter' });
    }

    const token = process.env.COC_API_TOKEN;
    if (!token) {
        return res.status(500).json({ error: 'COC_API_TOKEN not configured' });
    }

    const apiUrl = `https://api.clashofclans.com/v1/${apiPath}`;

    try {
        const response = await fetch(apiUrl, {
            method: req.method || 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('[CoC API Proxy Error]:', error);
        return res.status(500).json({
            error: 'Failed to fetch from Clash of Clans API',
            message: error.message
        });
    }
});

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// Handle client-side routing - serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
