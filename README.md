# n8n Workflow Automation Project

A complete n8n setup with local development, testing, and automated deployment to multiple hosting platforms.

## 🚀 Features

- **Local Development**: Easy setup with Docker Compose
- **Automated Deployment**: Deploy to Railway, Render, Heroku, and more
- **Workflow Sync**: Bidirectional synchronization between local and production
- **Backup System**: Automated backups with compression and rotation
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Multi-Environment**: Support for staging and production environments

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git
- GitHub account (for CI/CD)

## 🛠️ Local Setup

### 1. Clone and Install

```bash
cd n8n-project
npm install
cp env.example .env
nano .env
```

### 2. Start n8n Locally

```bash
docker-compose up -d
```

Access n8n at: http://localhost:5678

## 🚀 Deployment Options

### Railway (Recommended)
- Easy setup
- Automatic deployments
- Built-in PostgreSQL

### Render
- Free tier available
- Automatic deployments
- Custom domains

### Heroku
- Mature platform
- Extensive add-ons
- Good documentation

## 🔄 Workflow Sync

```bash
# Sync to production
npm run sync remote

# Sync from production
npm run sync local

# Backup workflows
npm run backup
```

## 📁 Project Structure

```
n8n-project/
├── .github/workflows/     # CI/CD pipelines
├── scripts/              # Deployment scripts
├── workflows/            # n8n workflow exports
├── docker-compose.yml    # Local development
└── README.md            # This file
```

## 🔐 Security

- Use environment variables for secrets
- Enable authentication in production
- Regular automated backups
- Use PostgreSQL in production

## 🆘 Support

- [n8n Documentation](https://docs.n8n.io/)
- [GitHub Issues](https://github.com/your-repo/issues)

---

**Happy Automating! 🎉** 
 