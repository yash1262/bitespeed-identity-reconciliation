# Step-by-Step Deployment Instructions

Follow these exact steps to deploy your service.

---

## PART 1: Push to GitHub (5 minutes)

### Step 1.1: Initialize Git
Open your terminal in the project folder and run:
```bash
git init
git add .
git commit -m "Initial commit: Identity reconciliation service"
```

### Step 1.2: Create GitHub Repository
1. Open browser and go to: https://github.com/new
2. Repository name: `bitespeed-identity-reconciliation`
3. Description: "Identity reconciliation service for Bitespeed assignment"
4. Keep it Public
5. Do NOT check "Add a README file"
6. Click "Create repository"

### Step 1.3: Push Code
Copy the commands shown on GitHub (replace YOUR_USERNAME with your actual username):
```bash
git remote add origin https://github.com/YOUR_USERNAME/bitespeed-identity-reconciliation.git
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## PART 2: Create Database on Render (3 minutes)

### Step 2.1: Sign Up/Login to Render
1. Go to: https://render.com
2. Click "Get Started" or "Sign In"
3. Sign up with GitHub (recommended) or email

### Step 2.2: Create PostgreSQL Database
1. Click the "New +" button (top right corner)
2. Select "PostgreSQL"
3. Fill in:
   - **Name**: `bitespeed-db`
   - **Database**: `bitespeed` (auto-filled)
   - **User**: (auto-generated, leave as is)
   - **Region**: Select closest to you (e.g., Oregon, Frankfurt, Singapore)
   - **PostgreSQL Version**: 16 (or latest)
   - **Datadog API Key**: Leave blank
   - **Plan**: Select "Free"
4. Click "Create Database"
5. Wait 1-2 minutes for database to be created

### Step 2.3: Copy Database URL
1. Once created, you'll see the database dashboard
2. Scroll down to "Connections" section
3. Find "Internal Database URL"
4. Click the copy icon next to it
5. **IMPORTANT**: Save this URL somewhere (you'll need it in the next step)
   - It looks like: `postgresql://bitespeed_user:xxxxx@dpg-xxxxx/bitespeed`

✅ Database is ready!

---

## PART 3: Deploy Web Service on Render (5 minutes)

### Step 3.1: Create Web Service
1. Click "New +" button again
2. Select "Web Service"

### Step 3.2: Connect GitHub
1. If first time: Click "Connect GitHub" and authorize Render
2. Find and select your `bitespeed-identity-reconciliation` repository
3. Click "Connect"

### Step 3.3: Configure Service
Fill in these fields:

**Basic Settings:**
- **Name**: `bitespeed-identity-service` (or any name you like)
- **Region**: Same region as your database (important!)
- **Branch**: `main`
- **Root Directory**: (leave blank)
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: 
  ```
  npm install && npm run build
  ```
- **Start Command**: 
  ```
  npm start
  ```

**Plan:**
- Select "Free"

### Step 3.4: Add Environment Variables
1. Scroll down to "Environment Variables" section
2. Click "Add Environment Variable"
3. Add first variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the Internal Database URL you copied in Step 2.3
4. Click "Add Environment Variable" again
5. Add second variable:
   - **Key**: `PORT`
   - **Value**: `3000`

### Step 3.5: Deploy
1. Click "Create Web Service" button at the bottom
2. Render will start deploying your service
3. You'll see logs appearing on the screen

### Step 3.6: Wait for Deployment
Watch the logs. You should see:
```
==> Building...
==> Installing dependencies...
==> Running build command...
==> Starting service...
Database initialized
Server is running on port 3000
```

This takes 2-5 minutes. When you see "Live" with a green dot at the top, it's ready!

### Step 3.7: Get Your Service URL
1. At the top of the page, you'll see your service URL
2. It looks like: `https://bitespeed-identity-service.onrender.com`
3. Copy this URL

✅ Service is deployed!

---

## PART 4: Test Your Deployment (2 minutes)

### Step 4.1: Test with curl
Open terminal and run (replace YOUR_URL with your actual service URL):
```bash
curl -X POST https://YOUR_URL.onrender.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phoneNumber":"123456"}'
```

You should get a response like:
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["test@example.com"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

### Step 4.2: Test with the Script
Or use the provided test script:
```bash
./test-api.sh https://YOUR_URL.onrender.com
```

### Step 4.3: Test with Postman (Optional)
1. Open Postman
2. Create new request:
   - Method: POST
   - URL: `https://YOUR_URL.onrender.com/identify`
   - Headers: Add `Content-Type: application/json`
   - Body: Select "raw" and "JSON", then paste:
     ```json
     {
       "email": "test@example.com",
       "phoneNumber": "123456"
     }
     ```
3. Click "Send"

✅ Your API is working!

---

## PART 5: Update README (1 minute)

### Step 5.1: Update README with Deployment URL
1. Open `README.md` in your editor
2. Find the line: `The service is deployed at: [Your deployment URL here]`
3. Replace it with: `The service is deployed at: https://YOUR_URL.onrender.com`
4. Save the file

### Step 5.2: Push Update to GitHub
```bash
git add README.md
git commit -m "Add deployment URL to README"
git push
```

✅ All done!

---

## Your Deployment URLs

Write them down here for reference:

- **GitHub Repository**: https://github.com/YOUR_USERNAME/bitespeed-identity-reconciliation
- **Render Service**: https://YOUR_SERVICE_NAME.onrender.com
- **API Endpoint**: https://YOUR_SERVICE_NAME.onrender.com/identify

---

## Important Notes

⚠️ **Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds to wake up
- Database expires after 90 days on free tier

💡 **Tips:**
- Monitor logs in Render dashboard to debug issues
- Use "Manual Deploy" button to redeploy if needed
- Check "Events" tab to see deployment history

🔧 **Troubleshooting:**
- If service won't start, check logs for errors
- If database connection fails, verify DATABASE_URL is correct
- If you see 502 error, wait 1-2 minutes for service to fully start

---

## Next Steps

1. Submit your assignment with the GitHub and Render URLs
2. Test all the scenarios from the assignment document
3. Monitor your service in the Render dashboard
4. Consider upgrading to paid tier for production use

Good luck! 🚀
