# Deployment Guide

## Step 1: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Identity reconciliation service"
```

2. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it: `bitespeed-identity-reconciliation`
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/bitespeed-identity-reconciliation.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Render.com

### 2.1 Create PostgreSQL Database

1. Go to https://render.com and sign up/login
2. Click "New +" button in the top right
3. Select "PostgreSQL"
4. Fill in the details:
   - Name: `bitespeed-db` (or any name you prefer)
   - Database: `bitespeed`
   - User: `bitespeed_user` (auto-generated)
   - Region: Choose closest to your users
   - Plan: Free (or paid for production)
5. Click "Create Database"
6. Wait for database to be created (takes 1-2 minutes)
7. Once created, copy the "Internal Database URL" (it looks like: `postgresql://user:password@host/database`)

### 2.2 Create Web Service

1. Click "New +" button again
2. Select "Web Service"
3. Connect your GitHub account if not already connected
4. Select your `bitespeed-identity-reconciliation` repository
5. Fill in the details:
   - Name: `bitespeed-identity-service` (or any name)
   - Region: Same as your database
   - Branch: `main`
   - Root Directory: leave blank
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free (or paid for production)

6. Add Environment Variables:
   - Click "Advanced" or scroll down to "Environment Variables"
   - Click "Add Environment Variable"
   - Key: `DATABASE_URL`
   - Value: Paste the Internal Database URL you copied from Step 2.1
   - Click "Add Environment Variable" again
   - Key: `PORT`
   - Value: `3000`

7. Click "Create Web Service"

### 2.3 Wait for Deployment

1. Render will automatically:
   - Clone your repository
   - Run `npm install && npm run build`
   - Start your service with `npm start`
   - This takes 2-5 minutes

2. Watch the logs in the Render dashboard to see progress

3. Once you see "Server is running on port 3000" in the logs, your service is live!

### 2.4 Get Your Service URL

1. Your service URL will be shown at the top of the page
2. It looks like: `https://bitespeed-identity-service.onrender.com`
3. Copy this URL

## Step 3: Test Your Deployment

Test the endpoint using curl:

```bash
curl -X POST https://YOUR_SERVICE_URL.onrender.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phoneNumber":"123456"}'
```

Or use Postman/Insomnia:
- Method: POST
- URL: `https://YOUR_SERVICE_URL.onrender.com/identify`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "phoneNumber": "123456"
}
```

## Step 4: Update README

Update the README.md file with your deployment URL:

```markdown
## Deployment

The service is deployed at: https://YOUR_SERVICE_URL.onrender.com

### API Endpoint

POST https://YOUR_SERVICE_URL.onrender.com/identify
```

Then commit and push:
```bash
git add README.md
git commit -m "Update deployment URL"
git push
```

## Troubleshooting

### Service won't start
- Check logs in Render dashboard
- Verify DATABASE_URL is set correctly
- Ensure build command completed successfully

### Database connection errors
- Verify you're using the "Internal Database URL" not "External"
- Check that database and web service are in the same region
- Ensure database is running (check PostgreSQL dashboard)

### 502 Bad Gateway
- Service is still starting up, wait 1-2 minutes
- Check logs for errors

### Free tier limitations
- Render free tier spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading to paid tier for production use

## Important Notes

1. Free tier databases on Render expire after 90 days
2. Free tier web services spin down after 15 minutes of inactivity
3. For production, use paid tiers for better reliability
4. Always use HTTPS (Render provides this automatically)
5. Monitor your logs regularly in the Render dashboard
