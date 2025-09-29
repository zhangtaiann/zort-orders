// server.js - Node.js Express Server for Sales Orders Dashboard
const express = require('express');
const https = require('https');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Environment variables validation
const STORENAME = process.env.STORENAME;
const APIKEY = process.env.APIKEY;
const APISECRET = process.env.APISECRET;

if (!STORENAME || !APIKEY || !APISECRET) {
    console.error('❌ Error: Missing required environment variables');
    console.log('Please make sure you have the following in your .env file:');
    console.log('- STORENAME=your-store-name');
    console.log('- APIKEY=your-api-key');
    console.log('- APISECRET=your-api-secret');
    process.exit(1);
}

// Function to make HTTPS request to Zortout API
function makeZortoutRequest(url, headers) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, { headers }, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        data: jsonData
                    });
                } catch (error) {
                    reject(new Error(`JSON Parse Error: ${error.message}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(new Error(`Request Error: ${error.message}`));
        });
        
        req.end();
    });
}

// Routes

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to get orders
app.get('/api/orders', async (req, res) => {
    try {
        console.log('📡 Fetching orders from Zortout API...');
        
        // Zortout API URL
        const apiUrl = 'https://open-api.zortout.com/v4/Order/GetOrders?page=1&limit=50&sortdirection=DESC&status=0,3&paymentstatus=1';
        
        // Headers for Zortout API
        const headers = {
            'storename': STORENAME,
            'apikey': APIKEY,
            'apisecret': APISECRET,
            'Content-Type': 'application/json'
        };
        
        // Make request to Zortout API
        const response = await makeZortoutRequest(apiUrl, headers);
        
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).json({
                success: false,
                message: `API Error: ${response.statusCode} - ตรวจสอบข้อมูล API credentials`
            });
        }
        
        const data = response.data;
        
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
                    name: product.name,
                    productid: product.productid,
                    number: product.number,
                    unittext: product.unittext,
                    pricepernumber: product.pricepernumber,
                    totalprice: product.totalprice
                }))
            }));

            console.log(`✅ Successfully fetched ${filteredOrders.length} orders`);
            
            res.json({
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
        console.error('❌ Orders API error:', error);
        
        res.status(500).json({
            success: false,
            message: `เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: ${error.message}`
        });
    }
});

// API endpoint to get product details
app.get('/api/product', async (req, res) => {
    try {
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
        
        // Headers for Zortout API
        const headers = {
            'storename': STORENAME,
            'apikey': APIKEY,
            'apisecret': APISECRET,
            'Content-Type': 'application/json'
        };
        
        // Make request to Zortout API
        const response = await makeZortoutRequest(apiUrl, headers);
        
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).json({
                success: false,
                message: `API Error: ${response.statusCode} - ตรวจสอบข้อมูล API credentials`
            });
        }
        
        const data = response.data;
        
        // Check if response has the standard res wrapper or direct product data
        if (data.res && data.res.resCode === "200" && data.product) {
            // Standard format with res wrapper
            console.log(`✅ Successfully fetched product: ${data.product.name}`);
            
            res.json({
                success: true,
                product: data.product,
                timestamp: new Date().toISOString()
            });
        } else if (data.id && data.name) {
            // Direct product format (GetProductDetail returns product directly)
            console.log(`✅ Successfully fetched product: ${data.name}`);
            
            res.json({
                success: true,
                product: data,
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(404).json({
                success: false,
                message: data.res?.resDesc || 'ไม่พบข้อมูลสินค้า'
            });
        }

    } catch (error) {
        console.error('❌ Product API error:', error);
        
        res.status(500).json({
            success: false,
            message: `เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: ${error.message}`
        });
    }
});

// API endpoint to get products list with search
app.get('/api/products', async (req, res) => {
    try {
        const { limit = 20, keyword = '' } = req.query;
        console.log(`📡 Fetching products list${keyword ? ` with keyword: "${keyword}"` : ''}`);
        
        // Zortout API URL for products list
        let apiUrl = `https://open-api.zortout.com/v4/Product/GetProducts?limit=${limit}`;
        if (keyword) {
            apiUrl += `&keyword=${encodeURIComponent(keyword)}`;
        }
        
        // Headers for Zortout API
        const headers = {
            'storename': STORENAME,
            'apikey': APIKEY,
            'apisecret': APISECRET,
            'Content-Type': 'application/json'
        };
        
        // Make request to Zortout API
        const response = await makeZortoutRequest(apiUrl, headers);
        
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).json({
                success: false,
                message: `API Error: ${response.statusCode} - ตรวจสอบข้อมูล API credentials`
            });
        }
        
        const data = response.data;
        
        if (data.res && data.res.resCode === "200" && data.list) {
            console.log(`✅ Successfully fetched ${data.list.length} products`);
            
            res.json({
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
        console.error('❌ Products API error:', error);
        
        res.status(500).json({
            success: false,
            message: `เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: ${error.message}`
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: {
            storename: STORENAME ? '✅ Set' : '❌ Missing',
            apikey: APIKEY ? '✅ Set' : '❌ Missing',
            apisecret: APISECRET ? '✅ Set' : '❌ Missing'
        }
    });
});



// Start server
app.listen(PORT, () => {
    console.log('🚀 Sales Orders Dashboard Server');
    console.log('================================');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    console.log('================================');
    console.log(`📋 Environment Variables:`);
    console.log(`   STORENAME: ${STORENAME ? '✅ Set' : '❌ Missing'}`);
    console.log(`   APIKEY: ${APIKEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`   APISECRET: ${APISECRET ? '✅ Set' : '❌ Missing'}`);
    console.log('================================');
    
    if (!STORENAME || !APIKEY || !APISECRET) {
        console.log('⚠️  Warning: Some environment variables are missing!');
        console.log('   Please check your .env file');
    } else {
        console.log('✅ All environment variables are set');
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});