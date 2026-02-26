# Quick Start Guide

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database locally:
```bash
# Install PostgreSQL if not already installed
# macOS:
brew install postgresql
brew services start postgresql

# Create database
createdb bitespeed
```

3. Create .env file:
```bash
cp .env.example .env
```

4. Edit .env:
```
PORT=3000
DATABASE_URL=postgresql://localhost:5432/bitespeed
```

5. Run the service:
```bash
# Development mode (with auto-reload)
npm run dev

# Or build and run production mode
npm run build
npm start
```

6. Test locally:
```bash
curl -X POST http://localhost:3000/identify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phoneNumber":"123456"}'
```

## GitHub Setup (First Time)

```bash
# Initialize git
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: Identity reconciliation service"

# Create repository on GitHub (https://github.com/new)
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/bitespeed-identity-reconciliation.git
git branch -M main
git push -u origin main
```

## Render.com Deployment (Summary)

1. Create PostgreSQL database on Render
2. Copy the "Internal Database URL"
3. Create Web Service on Render
4. Connect your GitHub repository
5. Set build command: `npm install && npm run build`
6. Set start command: `npm start`
7. Add environment variable: `DATABASE_URL` = (paste database URL)
8. Deploy!

See DEPLOYMENT.md for detailed step-by-step instructions.

## Making Changes

```bash
# Make your code changes
# Then:
git add .
git commit -m "Description of changes"
git push

# Render will automatically redeploy
```

## Useful Commands

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Make test script executable
chmod +x test-api.sh

# Test deployed API
./test-api.sh https://your-service.onrender.com
```
