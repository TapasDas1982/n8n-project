# n8n Deployment Guide

This guide covers deploying your n8n project to various hosting platforms with seamless sync capabilities.

## 🚀 Quick Deployment Options

### 1. Railway (Recommended for Beginners)

**Why Railway?**
- ✅ Easy setup
- ✅ Automatic deployments
- ✅ Built-in PostgreSQL
- ✅ Free tier available
- ✅ No configuration needed

**Setup Steps:**

1. **Create Railway Account**
   ```bash
   # Visit https://railway.app and sign up
   ```

2. **Connect Repository**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your n8n repository

3. **Configure Environment Variables**
   ```bash
   # In Railway dashboard, add these variables:
   N8N_BASIC_AUTH_ACTIVE=true
   N8N_BASIC_AUTH_USER=admin
   N8N_BASIC_AUTH_PASSWORD=your_secure_password
   DB_TYPE=postgresdb
   DB_POSTGRESDB_HOST=your_railway_postgres_host
   DB_POSTGRESDB_PORT=5432
   DB_POSTGRESDB_DATABASE=railway
   DB_POSTGRESDB_USER=postgres
   DB_POSTGRESDB_PASSWORD=your_railway_postgres_password
   N8N_ENCRYPTION_KEY=your_32_character_encryption_key
   WEBHOOK_URL=https://your-railway-app.railway.app
   ```

4. **Deploy**
   - Railway will automatically deploy on every push to main branch
   - Your n8n instance will be available at the provided URL

### 2. Render

**Why Render?**
- ✅ Free tier available
- ✅ Automatic deployments
- ✅ Custom domains
- ✅ Good documentation

**Setup Steps:**

1. **Create Render Account**
   ```bash
   # Visit https://render.com and sign up
   ```

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   ```bash
   # Build Command:
   npm install

   # Start Command:
   npm start

   # Environment Variables:
   N8N_BASIC_AUTH_ACTIVE=true
   N8N_BASIC_AUTH_USER=admin
   N8N_BASIC_AUTH_PASSWORD=your_secure_password
   DB_TYPE=postgresdb
   DB_POSTGRESDB_HOST=your_render_postgres_host
   DB_POSTGRESDB_PORT=5432
   DB_POSTGRESDB_DATABASE=n8n
   DB_POSTGRESDB_USER=n8n
   DB_POSTGRESDB_PASSWORD=your_render_postgres_password
   N8N_ENCRYPTION_KEY=your_32_character_encryption_key
   WEBHOOK_URL=https://your-render-app.onrender.com
   ```

4. **Deploy**
   - Render will automatically deploy on every push to main branch

### 3. Heroku

**Why Heroku?**
- ✅ Mature platform
- ✅ Extensive add-ons
- ✅ Good documentation
- ✅ Reliable

**Setup Steps:**

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku

   # Or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku App**
   ```bash
   heroku login
   heroku create your-n8n-app
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set N8N_BASIC_AUTH_ACTIVE=true
   heroku config:set N8N_BASIC_AUTH_USER=admin
   heroku config:set N8N_BASIC_AUTH_PASSWORD=your_secure_password
   heroku config:set DB_TYPE=postgresdb
   heroku config:set N8N_ENCRYPTION_KEY=your_32_character_encryption_key
   heroku config:set WEBHOOK_URL=https://your-n8n-app.herokuapp.com
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

## 🔄 Workflow Synchronization

### Setting Up Sync

1. **Get n8n API Token**
   ```bash
   # In your n8n instance:
   # Go to Settings → API → Generate API Token
   ```

2. **Configure GitHub Secrets**
   ```bash
   # In your GitHub repository:
   # Settings → Secrets and variables → Actions
   
   # Add these secrets:
   N8N_API_TOKEN=your_n8n_api_token
   DEPLOYMENT_URL=https://your-production-url.com
   ```

3. **Sync Commands**
   ```bash
   # Sync local workflows to production
   npm run sync remote

   # Sync production workflows to local
   npm run sync local

   # Bidirectional sync
   npm run sync both
   ```

### Automated Sync with GitHub Actions

The included GitHub Actions workflow will:
- Automatically sync workflows after deployment
- Backup workflows before sync
- Handle conflicts gracefully

## 🔐 Security Configuration

### Production Environment Variables

```bash
# Authentication
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_very_secure_password

# Database (PostgreSQL recommended)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=your_db_host
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=your_secure_db_password

# Security
N8N_ENCRYPTION_KEY=your_32_character_encryption_key
N8N_USER_MANAGEMENT_DISABLED=false

# Webhook URL (your production domain)
WEBHOOK_URL=https://your-production-domain.com

# Logging
N8N_LOG_LEVEL=info
N8N_LOG_OUTPUT=console
```

### Encryption Key Generation

```bash
# Generate a secure encryption key
openssl rand -hex 16
# or
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## 📊 Monitoring and Maintenance

### Health Checks

```bash
# Check if n8n is running
curl https://your-domain.com/healthz

# Check database connection
curl https://your-domain.com/api/v1/health
```

### Backup Strategy

```bash
# Automated backups (via GitHub Actions)
# Backups are created before every deployment

# Manual backup
npm run backup

# List backups
npm run backup list

# Restore from backup
npm run backup restore backup-name
```

### Log Monitoring

```bash
# View logs (platform-specific)
# Railway
railway logs

# Render
# View in Render dashboard

# Heroku
heroku logs --tail
```

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database credentials
   # Ensure database is accessible from your app
   # Verify network connectivity
   ```

2. **Webhook Not Working**
   ```bash
   # Verify WEBHOOK_URL is correct
   # Check if HTTPS is required
   # Ensure webhook endpoint is accessible
   ```

3. **Authentication Issues**
   ```bash
   # Verify N8N_BASIC_AUTH_ACTIVE=true
   # Check username/password
   # Clear browser cache
   ```

4. **Sync Failures**
   ```bash
   # Check N8N_API_TOKEN is valid
   # Verify DEPLOYMENT_URL is correct
   # Check network connectivity
   ```

### Debug Mode

```bash
# Enable debug logging
N8N_LOG_LEVEL=debug

# View detailed logs
# Platform-specific log viewing commands
```

## 🔄 Continuous Deployment

### GitHub Actions Setup

1. **Fork/Clone Repository**
2. **Add Secrets** (see Security Configuration)
3. **Push to Main Branch**
4. **Monitor Deployment**

### Deployment Triggers

- **Automatic**: Push to `main` branch
- **Manual**: GitHub Actions → Run workflow
- **Scheduled**: Configure cron jobs in workflow

## 📈 Scaling Considerations

### For High Traffic

1. **Database**: Use managed PostgreSQL
2. **Caching**: Add Redis for queue management
3. **Load Balancing**: Use multiple instances
4. **Monitoring**: Set up alerts and monitoring

### Cost Optimization

1. **Free Tiers**: Start with free tiers
2. **Resource Limits**: Monitor usage
3. **Auto-scaling**: Configure based on traffic
4. **Backup Retention**: Limit backup storage

## 🎯 Best Practices

1. **Environment Separation**: Use different environments for dev/staging/prod
2. **Secret Management**: Use platform secret management
3. **Regular Backups**: Automated daily backups
4. **Monitoring**: Set up health checks and alerts
5. **Documentation**: Keep deployment docs updated
6. **Testing**: Test deployments in staging first

---

**Need Help?** Create an issue in the GitHub repository or check the platform-specific documentation. 