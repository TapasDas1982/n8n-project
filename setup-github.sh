#!/bin/bash

echo "🚀 Setting up GitHub Repository and Deployment"
echo "=============================================="

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "📦 Installing GitHub CLI..."
    # Try to install gh CLI
    if command -v brew &> /dev/null; then
        brew install gh
    else
        echo "❌ GitHub CLI not found and Homebrew not available"
        echo "📝 Please install GitHub CLI manually:"
        echo "   Visit: https://cli.github.com/"
        echo "   Or run: brew install gh"
        exit 1
    fi
fi

echo "🔐 Authenticating with GitHub..."
gh auth login

echo "📁 Creating GitHub repository..."
REPO_NAME="n8n-workflows-$(date +%s)"
gh repo create $REPO_NAME --public --source=. --remote=origin --push

echo "✅ Repository created: https://github.com/$(gh api user --jq .login)/$REPO_NAME"

echo ""
echo "🌐 Next Steps for Deployment:"
echo "1. Visit Railway: https://railway.app"
echo "2. Sign up/Login with GitHub"
echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
echo "4. Select your repository: $REPO_NAME"
echo "5. Add environment variables (see DEPLOYMENT.md)"
echo "6. Deploy!"

echo ""
echo "🔑 Required Environment Variables for Railway:"
echo "N8N_BASIC_AUTH_ACTIVE=true"
echo "N8N_BASIC_AUTH_USER=admin"
echo "N8N_BASIC_AUTH_PASSWORD=your_secure_password"
echo "DB_TYPE=postgresdb"
echo "N8N_ENCRYPTION_KEY=5dd220a37ee64829b0ad8b3ee5552a53"
echo "WEBHOOK_URL=https://your-railway-app.railway.app"

echo ""
echo "🎉 Setup complete! Your repository is ready for deployment." 