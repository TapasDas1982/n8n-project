# 🚀 Deployment Checklist

Follow this checklist to deploy your n8n project with seamless sync:

## ✅ Pre-Deployment (Local Setup)

- [x] n8n running locally on http://localhost:5678
- [x] Git repository initialized
- [x] Project structure created
- [x] Environment variables configured
- [x] Test workflows created

## 🔄 Step 1: GitHub Repository Setup

### Option A: Automated Setup (Recommended)
```bash
./setup-github.sh
```

### Option B: Manual Setup
1. [ ] Create GitHub repository at https://github.com
2. [ ] Name it: `n8n-workflows`
3. [ ] Make it Public
4. [ ] Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/n8n-workflows.git
   git branch -M main
   git push -u origin main
   ```

## 🌐 Step 2: Deploy to Railway

1. [ ] Go to https://railway.app
2. [ ] Sign up/Login with GitHub
3. [ ] Click "New Project"
4. [ ] Select "Deploy from GitHub repo"
5. [ ] Choose your `n8n-workflows` repository
6. [ ] Click "Deploy Now"

## ⚙️ Step 3: Configure Environment Variables

In Railway dashboard, add these variables:

- [ ] `N8N_BASIC_AUTH_ACTIVE=true`
- [ ] `N8N_BASIC_AUTH_USER=admin`
- [ ] `N8N_BASIC_AUTH_PASSWORD=your_secure_password`
- [ ] `DB_TYPE=postgresdb`
- [ ] `N8N_ENCRYPTION_KEY=5dd220a37ee64829b0ad8b3ee5552a53`
- [ ] `WEBHOOK_URL=https://your-railway-app.railway.app`
- [ ] `N8N_HOST=your-railway-app.railway.app`
- [ ] `N8N_PORT=5678`
- [ ] `N8N_PROTOCOL=https`

## 🗄️ Step 4: Add PostgreSQL Database

1. [ ] In Railway dashboard, click "New"
2. [ ] Select "Database" → "PostgreSQL"
3. [ ] Railway will auto-connect it to your n8n service
4. [ ] Database credentials will be auto-set as environment variables

## 🧪 Step 5: Test Deployment

1. [ ] Visit your Railway URL (e.g., https://your-app-name.railway.app)
2. [ ] Login with admin/your_secure_password
3. [ ] Verify n8n is working
4. [ ] Create a test workflow
5. [ ] Export it to test sync functionality

## 🔄 Step 6: Set Up Sync

1. [ ] Get your production URL from Railway
2. [ ] Set environment variable:
   ```bash
   export DEPLOYMENT_URL=https://your-app-name.railway.app
   ```
3. [ ] Test sync commands:
   ```bash
   # Sync local workflows to production
   npm run sync remote
   
   # Sync production workflows to local
   npm run sync local
   ```

## 🤖 Step 7: Set Up GitHub Actions (Optional)

1. [ ] Go to your GitHub repository
2. [ ] Click "Settings" → "Secrets and variables" → "Actions"
3. [ ] Add these secrets:
   - [ ] `RAILWAY_TOKEN` (get from Railway dashboard)
   - [ ] `RAILWAY_SERVICE_ID` (get from Railway dashboard)
   - [ ] `N8N_API_TOKEN` (generate in your n8n instance)
   - [ ] `DEPLOYMENT_URL` (your Railway URL)

## 🎯 Step 8: Verify Everything Works

1. [ ] Local n8n: http://localhost:5678 ✅
2. [ ] Production n8n: https://your-app-name.railway.app ✅
3. [ ] Workflow sync: Local ↔ Production ✅
4. [ ] Automated deployments: Push to main branch ✅
5. [ ] Backup system: `npm run backup` ✅

## 📊 Step 9: Monitor and Maintain

1. [ ] Set up health checks
2. [ ] Monitor logs
3. [ ] Regular backups
4. [ ] Update workflows as needed

---

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check PostgreSQL is running in Railway
   - Verify environment variables are set correctly

2. **Sync Not Working**
   - Check `DEPLOYMENT_URL` is correct
   - Verify n8n API token is valid
   - Ensure workflows are in JSON format

3. **Deployment Failed**
   - Check Railway logs
   - Verify all environment variables are set
   - Ensure code is pushed to GitHub

### Need Help?

- Check `DEPLOYMENT.md` for detailed instructions
- Check `README.md` for general setup
- Create an issue in your GitHub repository

---

**🎉 Congratulations! You now have a fully automated n8n deployment with seamless sync!** 