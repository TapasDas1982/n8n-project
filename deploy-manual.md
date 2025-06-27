# Manual Deployment Setup

If you prefer to set up the GitHub repository manually, follow these steps:

## 1. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it: `n8n-workflows`
4. Make it Public
5. Don't initialize with README (we already have one)
6. Click "Create repository"

## 2. Push Your Code

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/n8n-workflows.git

# Push your code
git branch -M main
git push -u origin main
```

## 3. Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `n8n-workflows` repository
6. Click "Deploy Now"

## 4. Configure Environment Variables

In Railway dashboard, add these environment variables:

```bash
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_secure_password
DB_TYPE=postgresdb
N8N_ENCRYPTION_KEY=5dd220a37ee64829b0ad8b3ee5552a53
WEBHOOK_URL=https://your-railway-app.railway.app
N8N_HOST=your-railway-app.railway.app
N8N_PORT=5678
N8N_PROTOCOL=https
```

## 5. Add PostgreSQL Database

1. In Railway dashboard, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically connect it to your n8n service
4. The database credentials will be automatically set as environment variables

## 6. Get Your Production URL

After deployment, Railway will provide you with a URL like:
`https://your-app-name.railway.app`

## 7. Test Your Deployment

1. Visit your Railway URL
2. Login with admin/your_secure_password
3. Create a test workflow
4. Export it to your local workflows folder

## 8. Set Up Sync

Once deployed, you can sync workflows:

```bash
# Set your production URL
export DEPLOYMENT_URL=https://your-app-name.railway.app

# Sync local workflows to production
npm run sync remote

# Sync production workflows to local
npm run sync local
```

## 9. Set Up GitHub Actions (Optional)

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Add these secrets:
   - `RAILWAY_TOKEN` (get from Railway dashboard)
   - `RAILWAY_SERVICE_ID` (get from Railway dashboard)
   - `N8N_API_TOKEN` (generate in your n8n instance)
   - `DEPLOYMENT_URL` (your Railway URL)

Now you have automated deployments on every push to main branch!

---

**Need Help?** Check the main `DEPLOYMENT.md` file for more detailed instructions. 