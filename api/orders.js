// api/orders.js - Vercel Serverless Function
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

        // Fetch orders from Zortout API
        const apiUrl = 'https://open-api.zortout.com/v4/Order/GetOrders?page=1&limit=50&sortdirection=DESC&status=0,3&paymentstatus=1';
        
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
            // Filter and format data for security (remove sensitive customer info)
            const filteredOrders = data.list.map(order => ({
                id: order.id,
                number: order.number,
                status: order.status,
                paymentstatus: order.paymentstatus,
                saleschannel: order.saleschannel,
                shippingchannel: order.shippingchannel,
                amount: order.amount,
                orderdate: order.orderdate,
                customername: order.customername ? order.customername.replace(/(.{1}).*(.{1})/, '$1***$2') : '',
                list: order.list.map(product => ({
                    id: product.id,
                    productid: product.productid,
                    name: product.name,
                    number: product.number,
                    unittext: product.unittext,
                    pricepernumber: product.pricepernumber,
                    totalprice: product.totalprice
                }))
            }));

            res.status(200).json({
                success: true,
                orders: filteredOrders,
                count: data.count,
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(400).json({
                success: false,
                message: data.res?.resDesc || 'ไม่สามารถดึงข้อมูลได้'
            });
        }

    } catch (error) {
        console.error('Orders API error:', error);
        
        res.status(500).json({
            success: false,
            message: `เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: ${error.message}`
        });
    }
}