# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Sales Orders Dashboard application built with Node.js/Express backend and vanilla HTML/CSS/JavaScript frontend. The application connects to the Zortout API to fetch and display sales order data in a bilingual interface (Thai/English).

## Development Commands

```bash
# Start the development server
npm start
# or
npm run dev

# Test API connection before running the server
npm test
# or
node test-connection.js

# Test products API specifically
npm run test:products
# or
node test-products-api.js

# Test product detail API
node test-product-detail.js

# Start the server directly
node server.js
```

## Architecture

### Backend (server.js)
- **Express server** serving both API endpoints and static files
- **API proxy** to Zortout API with credential management
- **Security filtering** of customer data (anonymizing customer names)
- **CORS handling** for cross-origin requests
- **Environment variable validation** with startup checks

### Frontend Applications
The application consists of three main HTML pages:
1. **index.html** - Sales Orders Dashboard (main page)
   - Real-time order statistics and listing
   - Theme switching (light/dark mode with localStorage persistence)
   - Auto-refresh functionality
   - Responsive design with mobile-first approach

2. **products.html** - Products List Page
   - Product search functionality with keyword filtering
   - Product grid display with images and details
   - Pagination and filtering capabilities

3. **product.html** - Product Detail Search Page
   - Individual product detail lookup by ID
   - Comprehensive product information display

### API Structure
The application has dual API implementations:

#### Express Routes (server.js)
- `/api/orders` - Fetch sales orders with filtering
- `/api/products` - Get products list with search
- `/api/product` - Get individual product details by ID
- `/api/health` - Health check endpoint

#### Serverless Functions (api/ directory)
- `api/orders.js` - Orders endpoint for Vercel deployment
- `api/products.js` - Products list endpoint
- `api/product.js` - Product detail endpoint

### Environment Configuration
Required environment variables in `.env`:
- `STORENAME` - Zortout store identifier
- `APIKEY` - Zortout API key  
- `APISECRET` - Zortout API secret (used in server.js)
- `PORT` - Server port (optional, defaults to 3000)

**Important**: There's an inconsistency in variable naming:
- `server.js` and `test-products-api.js` use `APISECRET`
- `test-connection.js` uses `PISECRET`
- Verify which format your environment uses before testing

## Key Features

### Data Security
- Customer names are automatically anonymized (first and last character only)
- Sensitive API credentials are validated but never logged in full
- API responses are filtered to remove unnecessary data

### Bilingual Support
- Thai language primary interface
- English technical terms and API responses
- Thai currency formatting (THB)

### Error Handling
- Comprehensive API error handling with user-friendly Thai messages
- Network timeout handling (10-second timeout in test script)
- Environment variable validation on startup

## Testing

### Test Scripts Available:
1. **test-connection.js** (`npm test`)
   - Tests orders API connectivity
   - Validates environment variables
   - Uses `PISECRET` variable name
   - 10-second timeout for requests

2. **test-products-api.js** (`npm run test:products`)
   - Tests products API endpoints
   - Tests both general product listing and keyword search
   - Uses `APISECRET` variable name
   - Shows sample product data

3. **test-product-detail.js**
   - Tests individual product detail API
   - Requires manual execution with product ID

### Zortout API Endpoints Tested:
- `GetOrders` - Fetch sales orders with status and payment filters
- `GetProducts` - List products with optional keyword search
- `GetProductDetail` - Individual product details by ID

## Deployment Notes

- The application can run as a standalone Express server or be deployed to serverless platforms
- Static files are served directly from the root directory
- No build process required - vanilla HTML/CSS/JavaScript
- All dependencies are runtime dependencies (Express, dotenv)
- For serverless deployment, use the `api/` directory functions
- For Express deployment, use `server.js` with the same API routes