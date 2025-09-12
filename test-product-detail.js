// test-product-detail.js - ทดสอบการเชื่อมต่อ GetProductDetail API
const https = require('https');
require('dotenv').config();

console.log('🧪 Testing Zortout GetProductDetail API...\n');

// ตรวจสอบ Environment Variables
const STORENAME = process.env.STORENAME;
const APIKEY = process.env.APIKEY;
const APISECRET = process.env.APISECRET;

if (!STORENAME || !APIKEY || !APISECRET) {
    console.error('❌ Error: Missing API credentials');
    process.exit(1);
}

console.log('📋 Testing Product Detail API...\n');

// Test product IDs from the products list
const testProductIds = [4470988, 4470987, 4470964, 4470963, 4470962];

async function testProductDetail(productId) {
    return new Promise((resolve, reject) => {
        console.log(`🔍 Testing Product Detail for ID: ${productId}`);
        const testUrl = `https://open-api.zortout.com/v4/Product/GetProductDetail?id=${productId}`;
        
        const options = {
            method: 'GET',
            headers: {
                'storename': STORENAME,
                'apikey': APIKEY,
                'apisecret': APISECRET,
                'Content-Type': 'application/json'
            }
        };
        
        console.log(`📡 URL: ${testUrl}`);
        
        const req = https.request(testUrl, options, (res) => {
            console.log(`📊 HTTP Status: ${res.statusCode}`);
            
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                    console.log('📈 Raw API Response:');
                    console.log(JSON.stringify(jsonData, null, 2));
                    
                    if (res.statusCode === 200) {
                        console.log('✅ Product Detail API Response Received!');
                        
                        if (jsonData.res && jsonData.res.resCode === "200") {
                            console.log('✅ API Success Response');
                            if (jsonData.product) {
                                console.log('✅ Product data found');
                                console.log(`   Name: ${jsonData.product.name}`);
                                console.log(`   SKU: ${jsonData.product.sku}`);
                                console.log(`   Price: ${jsonData.product.sellprice}`);
                            } else {
                                console.log('❌ No product data in response');
                            }
                        } else {
                            console.log('❌ API Error Response');
                            console.log(`   Response Code: ${jsonData.res?.resCode}`);
                            console.log(`   Response Description: ${jsonData.res?.resDesc}`);
                        }
                        resolve(jsonData);
                    } else {
                        console.log('❌ HTTP Error Response');
                        console.log(`   Status: ${res.statusCode}`);
                        resolve(jsonData);
                    }
                    
                    console.log('═══════════════════════════════════════════════════════════\n');
                    
                } catch (error) {
                    console.log('❌ JSON Parse Error!');
                    console.log(`   Raw Response: ${data}`);
                    console.log('═══════════════════════════════════════════════════════════\n');
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log('❌ Request Error!');
            console.log(`   Error: ${error.message}`);
            console.log('═══════════════════════════════════════════════════════════\n');
            reject(error);
        });
        
        req.setTimeout(10000, () => {
            console.log('❌ Request Timeout!');
            console.log('═══════════════════════════════════════════════════════════\n');
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.end();
    });
}

// Test alternative API endpoint without "Detail"
async function testProductGet(productId) {
    return new Promise((resolve, reject) => {
        console.log(`🔍 Testing GetProduct (without Detail) for ID: ${productId}`);
        const testUrl = `https://open-api.zortout.com/v4/Product/GetProduct?id=${productId}`;
        
        const options = {
            method: 'GET',
            headers: {
                'storename': STORENAME,
                'apikey': APIKEY,
                'apisecret': APISECRET,
                'Content-Type': 'application/json'
            }
        };
        
        console.log(`📡 Alternative URL: ${testUrl}`);
        
        const req = https.request(testUrl, options, (res) => {
            console.log(`📊 HTTP Status: ${res.statusCode}`);
            
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                    console.log('📈 Alternative API Response:');
                    console.log(JSON.stringify(jsonData, null, 2));
                    console.log('═══════════════════════════════════════════════════════════\n');
                    
                    resolve(jsonData);
                    
                } catch (error) {
                    console.log('❌ JSON Parse Error!');
                    console.log(`   Raw Response: ${data}`);
                    console.log('═══════════════════════════════════════════════════════════\n');
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log('❌ Request Error!');
            console.log(`   Error: ${error.message}`);
            console.log('═══════════════════════════════════════════════════════════\n');
            reject(error);
        });
        
        req.setTimeout(10000, () => {
            console.log('❌ Request Timeout!');
            console.log('═══════════════════════════════════════════════════════════\n');
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.end();
    });
}

// Run tests
async function runTests() {
    try {
        // Test GetProductDetail with multiple IDs
        for (let productId of testProductIds) {
            try {
                await testProductDetail(productId);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between requests
            } catch (error) {
                console.log(`Failed for product ${productId}: ${error.message}`);
            }
        }
        
        // Test alternative GetProduct API
        console.log('🔄 Testing alternative GetProduct API (without Detail)...\n');
        try {
            await testProductGet(testProductIds[0]);
        } catch (error) {
            console.log(`Alternative API failed: ${error.message}`);
        }
        
        console.log('🎉 Product Detail API tests completed!');
        console.log('\n💡 Analysis:');
        console.log('   - Check if GetProductDetail returns different response structure');
        console.log('   - Verify if product IDs exist in the detail API');
        console.log('   - Consider using GetProduct instead of GetProductDetail');
        
    } catch (error) {
        console.log('❌ Test Failed!');
        console.log(`   Error: ${error.message}`);
    }
}

runTests();