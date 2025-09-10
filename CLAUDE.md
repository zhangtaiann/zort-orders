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

### Frontend (index.html)
- **Single-page application** with embedded CSS and JavaScript
- **Responsive design** with mobile-first approach
- **Theme switching** (light/dark mode with localStorage persistence)
- **Auto-refresh functionality** (5-minute intervals)
- **Real-time statistics** showing order counts and payment status

### API Structure
The application has dual API implementations:
1. **Express routes** in `server.js` (`/api/orders`, `/api/health`)
2. **Serverless function** in `api/orders.js` (for deployment platforms like Vercel)

### Environment Configuration
Required environment variables in `.env`:
- `STORENAME` - Zortout store identifier
- `APIKEY` - Zortout API key  
- `APISECRET` - Zortout API secret
- `PORT` - Server port (optional, defaults to 3000)

**Note**: There's an inconsistency in variable naming - `server.js` uses `APISECRET` while `test-connection.js` and `api/orders.js` use `PISECRET`. Check which format your environment uses.

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

Use `test-connection.js` to verify:
- Environment variables are properly configured
- API credentials are valid
- Zortout API is accessible
- Sample data can be retrieved

## Deployment Notes

- The application can run as a standalone Express server or be deployed to serverless platforms
- Static files are served directly from the root directory
- No build process required - vanilla HTML/CSS/JavaScript
- All dependencies are runtime dependencies (Express, dotenv)