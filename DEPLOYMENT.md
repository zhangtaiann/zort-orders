# Vercel Deployment Instructions

## Files Created for Deployment

✅ **api/orders.js** - Serverless function for Zortout API integration
✅ **vercel.json** - Vercel configuration file
✅ **.env.example** - Environment variables template

## How to Deploy to Vercel

### Method 1: GitHub + Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a static site with serverless functions

3. **Set Environment Variables**
   In Vercel Dashboard → Project Settings → Environment Variables, add:
   - `STORENAME` = `formflex3d@gmail.com`
   - `APIKEY` = `n08hXupJanZKELSmH7yIIRcMKrUElmp4TkgchoYjkv4=`
   - `APISECRET` = `6yEQxhaQvt1CaIEzHM3lS1W9sboSjXo9KHILJ8wQsA=`

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   # or
   npx vercel
   ```

2. **Login and Deploy**
   ```bash
   vercel login
   vercel
   ```

3. **Follow the prompts**
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - What's your project's name? **sales-orders-dashboard**
   - In which directory is your code located? **./

4. **Set Environment Variables**
   ```bash
   vercel env add STORENAME production
   vercel env add APIKEY production
   vercel env add APISECRET production
   ```

## Project Structure

```
/
├── api/
│   └── orders.js          # Serverless function
├── index.html             # Main dashboard
├── package.json           # Node.js dependencies
├── vercel.json           # Vercel configuration
├── .env.example          # Environment variables template
└── DEPLOYMENT.md         # This file
```

## API Endpoints (After Deployment)

- **Dashboard**: `https://your-project.vercel.app/`
- **Orders API**: `https://your-project.vercel.app/api/orders`

## Important Notes

1. **Environment Variables**: Make sure to set all required environment variables in Vercel dashboard
2. **API Endpoints**: The frontend automatically uses `/api/orders` which will be handled by Vercel's serverless functions
3. **CORS**: Already configured in the serverless function
4. **Security**: Customer data is automatically anonymized in the API response

## Troubleshooting

- If deployment fails, check the build logs in Vercel dashboard
- Ensure environment variables are set correctly
- Verify API credentials are working with the test connection script locally first