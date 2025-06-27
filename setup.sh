#!/bin/bash

echo "🚀 n8n Project Setup Script"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    echo "📦 Installing Node.js..."
    
    # Try different installation methods
    if command -v brew &> /dev/null; then
        echo "Using Homebrew to install Node.js..."
        brew install node
    elif command -v curl &> /dev/null; then
        echo "Downloading Node.js from official website..."
        echo "Please visit https://nodejs.org and install Node.js manually"
        echo "Or run: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
        echo "Then: nvm install 18 && nvm use 18"
    else
        echo "Please install Node.js manually from https://nodejs.org"
    fi
else
    echo "✅ Node.js found: $(node --version)"
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found"
    echo "📦 Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
else
    echo "✅ Docker found: $(docker --version)"
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found"
    echo "📦 Please install Docker Compose or use 'docker compose' (newer Docker versions)"
else
    echo "✅ Docker Compose found: $(docker-compose --version)"
fi

echo ""
echo "🔧 Setting up n8n project..."

# Create necessary directories
mkdir -p workflows credentials data backups

# Copy environment template
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created .env file from template"
    echo "📝 Please edit .env file with your configuration"
else
    echo "✅ .env file already exists"
fi

# Install npm dependencies if Node.js is available
if command -v npm &> /dev/null; then
    echo "📦 Installing npm dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "⚠️ npm not available, skipping dependency installation"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Run: docker-compose up -d"
echo "3. Access n8n at: http://localhost:5678"
echo ""
echo "For deployment options, see README.md" 