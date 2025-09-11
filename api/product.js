// api/product.js - Vercel Serverless Function for Single Product Details
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
        const apisecret = process.env.APISECRET || process.env.PISECRET;

        // Validate environment variables
        if (!storename || !apikey || !apisecret) {
            return res.status(500).json({
                success: false,
                message: 'ข้อมูล API ไม่ได้ถูกตั้งค่าใน environment variables'
            });
        }

        // Get product ID from query parameter
        const productId = req.query.id;
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        console.log(`📡 Fetching product details for ID: ${productId}`);

        // Zortout API URL for product details
        const apiUrl = `https://open-api.zortout.com/v4/Product/GetProductDetail?id=${productId}`;
        
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
        
        if (data.res && data.res.resCode === "200" && data.product) {
            console.log(`✅ Successfully fetched product: ${data.product.name}`);
            
            res.status(200).json({
                success: true,
                product: data.product,
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(404).json({
                success: false,
                message: data.res?.resDesc || 'ไม่พบข้อมูลสินค้า'
            });
        }

    } catch (error) {
        console.error('Product API error:', error);
        
        res.status(500).json({
            success: false,
            message: `เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: ${error.message}`
        });
    }
}