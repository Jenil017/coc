import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (optional but helpful for debugging)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ==================== API ROUTES ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
    return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Check IP endpoint - helps verify which IP Render/Vercel is using
app.get('/api/check-ip', async (req, res) => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch IP: ${response.statusText}`);
        }
        
        const data = await response.json();

        return res.status(200).json({
            vercelIP: data.ip,
            message: 'Add this IP to your Clash of Clans API key',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[Check IP Error]:', error);
        return res.status(500).json({ 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// CoC API proxy endpoint - forwards requests to Clash of Clans API
app.get('/api/coc/', async (req, res) => {
    const { path: apiPath, ...queryParams } = req.query;

    // Validate required path parameter
    if (!apiPath || typeof apiPath !== 'string') {
        return res.status(400).json({ 
            error: 'Missing or invalid "path" query parameter',
            example: '/api/coc/?path=clans/%23CLANTAG'
        });
    }

    // Validate API token exists
    const token = process.env.COC_API_TOKEN;
    if (!token) {
        console.error('[CoC API] Missing COC_API_TOKEN environment variable');
        return res.status(500).json({ 
            error: 'Server configuration error: COC_API_TOKEN not set' 
        });
    }

    // Build full API URL
    const apiUrl = `https://api.clashofclans.com/v1/${apiPath}`;

    try {
        // Set timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(apiUrl, {
            method: req.method || 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'ClashOfClans-Relay/1.0'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        return res.status(response.status).json({
            status: response.status,
            data: data
        });
    } catch (error) {
        console.error('[CoC API Proxy Error]:', error);
        
        // Handle different error types
        if (error.name === 'AbortError') {
            return res.status(504).json({
                error: 'Gateway timeout - Clash of Clans API took too long to respond',
                timestamp: new Date().toISOString()
            });
        }

        return res.status(502).json({
            error: 'Failed to fetch from Clash of Clans API',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// ==================== STATIC FILES & SPA ROUTING ====================

// Serve static files from Vite build output
app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '1d', // Cache static assets for 1 day
    etag: true
}));

// Handle client-side routing - serve index.html for all other routes
// IMPORTANT: Use '*' not '/*' for Express v5+ compatibility
app.use('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }

    res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
        if (err) {
            console.error('[Static File Error]:', err);
            return res.status(500).json({ error: 'Failed to load application' });
        }
    });
});

// ==================== ERROR HANDLING ====================

// 404 handler (catches anything that doesn't match above)
app.use((req, res) => {
    return res.status(404).json({ 
        error: 'Not found',
        path: req.path,
        method: req.method
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('[Global Error Handler]:', err);
    return res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
        timestamp: new Date().toISOString()
    });
});

// ==================== SERVER STARTUP ====================

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║  CoC Relay Server                     ║
║  Running on port ${PORT}                ║
║  Environment: ${process.env.NODE_ENV || 'production'}            ║
╚═══════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});