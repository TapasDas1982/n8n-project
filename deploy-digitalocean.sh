#!/bin/bash

echo "🚀 DigitalOcean n8n Deployment Script"
echo "====================================="

# Configuration
DOMAIN="your-domain.com"
MYSQL_HOST="localhost"
MYSQL_USER="n8n"
MYSQL_PASSWORD="your_mysql_password"
MYSQL_DATABASE="n8n"

echo "📋 Prerequisites Check:"
echo "1. Ensure Docker and Docker Compose are installed on your server"
echo "2. Ensure Apache mod_proxy and mod_rewrite are enabled"
echo "3. Ensure MySQL is running and accessible"
echo "4. Ensure you have SSL certificates for your domain"
echo ""

# Check if running on server
if [ "$EUID" -ne 0 ]; then
    echo "⚠️ This script should be run on your DigitalOcean server as root or with sudo"
    echo "Please SSH to your server and run this script there"
    exit 1
fi

echo "🔧 Installing required Apache modules..."
a2enmod proxy
a2enmod proxy_http
a2enmod proxy_wstunnel
a2enmod rewrite
a2enmod ssl
a2enmod headers

echo "🗄️ Setting up MySQL database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;"
mysql -u root -p -e "CREATE USER IF NOT EXISTS '$MYSQL_USER'@'localhost' IDENTIFIED BY '$MYSQL_PASSWORD';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"

echo "📁 Creating n8n directory..."
mkdir -p /opt/n8n
cd /opt/n8n

echo "📥 Cloning repository..."
git clone https://github.com/TapasDas1982/n8n-project.git .
chown -R www-data:www-data /opt/n8n

echo "🔐 Creating environment file..."
cat > .env << EOF
# n8n Configuration for DigitalOcean
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_secure_password

# Database Configuration (MySQL)
DB_TYPE=mysqldb
DB_MYSQLDB_HOST=$MYSQL_HOST
DB_MYSQLDB_PORT=3306
DB_MYSQLDB_DATABASE=$MYSQL_DATABASE
DB_MYSQLDB_USER=$MYSQL_USER
DB_MYSQLDB_PASSWORD=$MYSQL_PASSWORD

# Webhook Configuration
N8N_HOST=$DOMAIN
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://$DOMAIN

# Security
N8N_ENCRYPTION_KEY=5dd220a37ee64829b0ad8b3ee5552a53
N8N_USER_MANAGEMENT_DISABLED=false

# Logging
N8N_LOG_LEVEL=info
N8N_LOG_OUTPUT=console

# Deployment
DEPLOYMENT_ENV=production
DEPLOYMENT_URL=https://$DOMAIN
EOF

echo "🔧 Configuring Apache..."
cp apache-n8n.conf /etc/apache2/sites-available/n8n.conf
sed -i "s/your-domain.com/$DOMAIN/g" /etc/apache2/sites-available/n8n.conf

echo "📁 Creating directories..."
mkdir -p workflows credentials data backups

echo "🚀 Starting n8n..."
docker-compose -f docker-compose.digitalocean.yml up -d

echo "🔗 Enabling Apache site..."
a2ensite n8n
systemctl reload apache2

echo "✅ Deployment completed!"
echo ""
echo "🌐 Your n8n instance should be available at: https://$DOMAIN"
echo "🔑 Login credentials: admin / your_secure_password"
echo ""
echo "📊 To check status:"
echo "   docker-compose -f docker-compose.digitalocean.yml ps"
echo ""
echo "📝 To view logs:"
echo "   docker-compose -f docker-compose.digitalocean.yml logs -f n8n"
echo ""
echo "🔄 To sync workflows:"
echo "   npm run sync remote"
echo ""
echo "⚠️ Don't forget to:"
echo "   1. Update SSL certificate paths in Apache config"
echo "   2. Change the default password"
echo "   3. Set up regular backups"
echo "   4. Configure firewall rules" 