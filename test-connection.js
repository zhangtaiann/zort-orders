// test-connection.js - ทดสอบการเชื่อมต่อ API ก่อนรันเซิร์ฟเวอร์
const https = require('https');
require('dotenv').config();

console.log('🧪 Testing Zortout API Connection...\n');

// ตรวจสอบ Environment Variables
const STORENAME = process.env.STORENAME;
const APIKEY = process.env.APIKEY;
const PISECRET = process.env.PISECRET;

if (!STORENAME || !APIKEY || !PISECRET) {
    console.error('❌ Error: Missing API credentials in .env file');
    console.log('\nPlease make sure your .env file contains:');
    console.log('STORENAME=your-store-name');
    console.log('APIKEY=your-api-key');
    console.log('PISECRET=your-pi-secret\n');
    process.exit(1);
}

console.log('📋 Environment Variables Check:');
console.log(`✅ STORENAME: ${STORENAME}`);
console.log(`✅ APIKEY: ${APIKEY.substring(0, 8)}...`);
console.log(`✅ PISECRET: ${PISECRET.substring(0, 8)}...\n`);

// ทดสอบการเชื่อมต่อ
const testUrl = 'https://open-api.zortout.com/v4/Order/GetOrders?status="0,3"&limit=3&paymentstatus=1&sortdirection=DESC';

const options = {
    method: 'GET',
    headers: {
        'storename': STORENAME,
        'apikey': APIKEY,
        'pisecret': PISECRET,
        'Content-Type': 'application/json'
    }
};

console.log('🔍 Testing API connection to Zortout...');
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
                console.log('✅ API Connection Successful!\n');
                
                console.log('📈 API Response Details:');
                console.log(`   Response Code: ${jsonData.res?.resCode}`);
                console.log(`   Response Description: ${jsonData.res?.resDesc || 'Success'}`);
                console.log(`   Total Orders Found: ${jsonData.list?.length || 0}`);
                console.log(`   Total Count: ${jsonData.count || 0}\n`);
                
                if (jsonData.list && jsonData.list.length > 0) {
                    console.log('📋 Sample Orders:');
                    jsonData.list.slice(0, 3).forEach((order, index) => {
                        console.log(`   ${index + 1}. Order #${order.number}`);
                        console.log(`      Status: ${order.status} | Payment: ${order.paymentstatus}`);
                        console.log(`      Channel: ${order.saleschannel}`);
                        console.log(`      Amount: ${order.amount} THB`);
                        console.log(`      Products: ${order.list?.length || 0} items\n`);
                    });
                } else {
                    console.log('📝 No orders found matching the criteria\n');
                }
                
                console.log('🎉 Ready to start the server!');
                console.log('Run: npm start');
                
            } else {
                console.log('❌ API Error Response:');
                console.log(JSON.stringify(jsonData, null, 2));
            }
        } catch (error) {
            console.log('❌ JSON Parse Error:', error.message);
            console.log('Raw Response Data:', data.substring(0, 500) + '...');
        }
    });
});

req.on('error', (error) => {
    console.log('❌ Network Error:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Check your internet connection');
    console.log('2. Verify API credentials in .env file');
    console.log('3. Check if Zortout API is accessible');
});

req.setTimeout(10000, () => {
    console.log('❌ Request Timeout: API took too long to respond');
    req.destroy();
});

req.end();