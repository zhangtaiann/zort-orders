// test-products-api.js - ทดสอบการเชื่อมต่อ Products API
const https = require('https');
require('dotenv').config();

console.log('🧪 Testing Zortout Products API Connection...\n');

// ตรวจสอบ Environment Variables
const STORENAME = process.env.STORENAME;
const APIKEY = process.env.APIKEY;
const APISECRET = process.env.APISECRET;

if (!STORENAME || !APIKEY || !APISECRET) {
    console.error('❌ Error: Missing API credentials in .env file');
    console.log('\nPlease make sure your .env file contains:');
    console.log('STORENAME=your-store-name');
    console.log('APIKEY=your-api-key');
    console.log('APISECRET=your-api-secret\n');
    process.exit(1);
}

console.log('📋 Environment Variables Check:');
console.log(`✅ STORENAME: ${STORENAME}`);
console.log(`✅ APIKEY: ${APIKEY.substring(0, 8)}...`);
console.log(`✅ APISECRET: ${APISECRET.substring(0, 8)}...\n`);

// Test 1: ทดสอบ GetProducts API
function testGetProducts() {
    return new Promise((resolve, reject) => {
        console.log('🔍 Testing GetProducts API...');
        const testUrl = 'https://open-api.zortout.com/v4/Product/GetProducts?limit=20';
        
        const options = {
            method: 'GET',
            headers: {
                'storename': STORENAME,
                'apikey': APIKEY,
                'apisecret': APISECRET,
                'Content-Type': 'application/json'
            }
        };
        
        console.log(`📡 URL: ${testUrl}\n`);
        
        const req = https.request(testUrl, options, (res) => {
            console.log(`📊 HTTP Status: ${res.statusCode}`);
            
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                    if (res.statusCode === 200) {
                        console.log('✅ GetProducts API Connection Successful!\n');
                        
                        console.log('📈 API Response Details:');
                        console.log(`   Response Code: ${jsonData.res?.resCode}`);
                        console.log(`   Response Description: ${jsonData.res?.resDesc || 'Success'}`);
                        console.log(`   Total Products Found: ${jsonData.count || 0}`);
                        console.log(`   Products in Response: ${jsonData.list?.length || 0}\n`);
                        
                        if (jsonData.list && jsonData.list.length > 0) {
                            console.log('📦 Sample Products:');
                            jsonData.list.slice(0, 3).forEach((product, index) => {
                                console.log(`   ${index + 1}. ${product.name || 'No name'}`);
                                console.log(`      SKU: ${product.sku || 'No SKU'}`);
                                console.log(`      Price: ${product.sellprice || 'N/A'} THB`);
                                console.log(`      Stock: ${product.stock || 0} ${product.unittext || 'units'}`);
                                console.log('');
                            });
                        }
                        resolve(jsonData);
                    } else {
                        console.log('❌ GetProducts API Error!');
                        console.log(`   Status: ${res.statusCode}`);
                        console.log(`   Response: ${JSON.stringify(jsonData, null, 2)}`);
                        reject(new Error(`API Error: ${res.statusCode}`));
                    }
                } catch (error) {
                    console.log('❌ JSON Parse Error!');
                    console.log(`   Raw Response: ${data}`);
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log('❌ Request Error!');
            console.log(`   Error: ${error.message}`);
            reject(error);
        });
        
        req.setTimeout(10000, () => {
            console.log('❌ Request Timeout!');
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.end();
    });
}

// Test 2: ทดสอบ GetProducts API with keyword
function testGetProductsWithKeyword() {
    return new Promise((resolve, reject) => {
        console.log('🔍 Testing GetProducts API with keyword...');
        const testUrl = 'https://open-api.zortout.com/v4/Product/GetProducts?limit=20&keyword=kexcelled';
        
        const options = {
            method: 'GET',
            headers: {
                'storename': STORENAME,
                'apikey': APIKEY,
                'apisecret': APISECRET,
                'Content-Type': 'application/json'
            }
        };
        
        console.log(`📡 URL: ${testUrl}\n`);
        
        const req = https.request(testUrl, options, (res) => {
            console.log(`📊 HTTP Status: ${res.statusCode}`);
            
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                    if (res.statusCode === 200) {
                        console.log('✅ GetProducts with Keyword API Connection Successful!\n');
                        
                        console.log('📈 Search API Response Details:');
                        console.log(`   Response Code: ${jsonData.res?.resCode}`);
                        console.log(`   Response Description: ${jsonData.res?.resDesc || 'Success'}`);
                        console.log(`   Search Results: ${jsonData.list?.length || 0} products found\n`);
                        
                        if (jsonData.list && jsonData.list.length > 0) {
                            console.log('🔍 Search Results for "kexcelled":');
                            jsonData.list.forEach((product, index) => {
                                console.log(`   ${index + 1}. ${product.name || 'No name'}`);
                                console.log(`      SKU: ${product.sku || 'No SKU'}`);
                                console.log(`      Price: ${product.sellprice || 'N/A'} THB`);
                                console.log('');
                            });
                        } else {
                            console.log('   No products found for keyword "kexcelled"');
                        }
                        resolve(jsonData);
                    } else {
                        console.log('❌ GetProducts with Keyword API Error!');
                        console.log(`   Status: ${res.statusCode}`);
                        console.log(`   Response: ${JSON.stringify(jsonData, null, 2)}`);
                        reject(new Error(`API Error: ${res.statusCode}`));
                    }
                } catch (error) {
                    console.log('❌ JSON Parse Error!');
                    console.log(`   Raw Response: ${data}`);
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log('❌ Request Error!');
            console.log(`   Error: ${error.message}`);
            reject(error);
        });
        
        req.setTimeout(10000, () => {
            console.log('❌ Request Timeout!');
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.end();
    });
}

// รันการทดสอบ
async function runTests() {
    try {
        await testGetProducts();
        console.log('═══════════════════════════════════════════════════════════\n');
        await testGetProductsWithKeyword();
        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('🎉 All API tests completed successfully!');
        console.log('\n💡 Tips:');
        console.log('   - Both GetProducts endpoints are working correctly');
        console.log('   - You can now use these APIs in your application');
        console.log('   - Make sure your server.js has the correct API endpoints');
    } catch (error) {
        console.log('═══════════════════════════════════════════════════════════\n');
        console.log('❌ API Test Failed!');
        console.log(`   Error: ${error.message}`);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Check your .env file has correct credentials');
        console.log('   2. Verify your internet connection');
        console.log('   3. Check if the API endpoint URL is correct');
        console.log('   4. Try running: node test-connection.js first');
    }
}

runTests();