// api/debug.js - Debug endpoint for Vercel
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const envVars = {
            STORENAME: process.env.STORENAME ? 'SET' : 'MISSING',
            APIKEY: process.env.APIKEY ? 'SET' : 'MISSING',
            APISECRET: process.env.APISECRET ? 'SET' : 'MISSING'
        };

        res.status(200).json({
            success: true,
            message: 'Debug endpoint working',
            environment: envVars,
            method: req.method,
            url: req.url,
            query: req.query,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Debug error: ${error.message}`,
            timestamp: new Date().toISOString()
        });
    }
}