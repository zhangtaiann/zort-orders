// api/products.js - Vercel Serverless Function for Products List
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

    if (req.method !== 'GET') {
        return res.status(405).json({ 
            success: false, 
            message: 'Method not allowed' 
        });
    }

    try {
        // Get API credentials from environment variables
        const storename = process.env.STORENAME;
        const apikey = process.env.APIKEY;
        const apisecret = process.env.APISECRET;

        // Validate environment variables
        if (!storename || !apikey || !apisecret) {
            return res.status(500).json({
                success: false,
                message: 'ข้อมูล API ไม่ได้ถูกตั้งค่าใน environment variables'
            });
        }

        // Get query parameters
        const { limit = 20, keyword = '' } = req.query;
        console.log(`📡 Fetching products list${keyword ? ` with keyword: "${keyword}"` : ''}`);

        // Zortout API URL for products list
        let apiUrl = `https://open-api.zortout.com/v4/Product/GetProducts?limit=20&keyword=kexcelled`;
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'storename': storename,
                'apikey': apikey,
                'apisecret': apisecret,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                message: `API Error: ${response.status} - ตรวจสอบข้อมูล API credentials`
            });
        }

        const data = await response.json();
        
        if (data.res && data.res.resCode === "200" && data.list) {
            console.log(`✅ Successfully fetched ${data.list.length} products`);
            
            res.status(200).json({
                success: true,
                products: data.list,
                count: data.count,
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(404).json({
                success: false,
                message: data.res?.resDesc || 'ไม่พบข้อมูลสินค้า'
            });
        }

    } catch (error) {
        console.error('Products API error:', error);
        
        res.status(500).json({
            success: false,
            message: `เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: ${error.message}`
        });
    }
}