#!/bin/bash

# Votely Backend Platform-Specific Deployment Scripts
# This script provides deployment commands for different hosting platforms

echo "🚀 Votely Backend Platform Deployment Scripts"
echo "=============================================="

# Function to show platform options
show_platforms() {
    echo ""
    echo "Available deployment platforms:"
    echo "1. VPS/Server (Ubuntu/CentOS)"
    echo "2. Docker"
    echo "3. Heroku"
    echo "4. Railway"
    echo "5. DigitalOcean App Platform"
    echo "6. AWS Elastic Beanstalk"
    echo "7. Google Cloud Run"
    echo "8. Exit"
    echo ""
}

# Function for VPS deployment
deploy_vps() {
    echo "🖥️  VPS/Server Deployment"
    echo "=========================="
    echo ""
    echo "Run these commands on your VPS:"
    echo ""
    echo "# Update system"
    echo "sudo apt update && sudo apt upgrade -y"
    echo ""
    echo "# Install Node.js 18"
    echo "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    echo "sudo apt-get install -y nodejs"
    echo ""
    echo "# Install PM2"
    echo "sudo npm install -g pm2"
    echo ""
    echo "# Install Nginx (reverse proxy)"
    echo "sudo apt install -y nginx"
    echo ""
    echo "# Clone and setup application"
    echo "git clone https://github.com/yourusername/votely.git"
    echo "cd votely/backend"
    echo "npm install --production"
    echo "cp production.env.example .env"
    echo "nano .env  # Edit with your values"
    echo ""
    echo "# Start with PM2"
    echo "pm2 start src/server.js --name 'votely-backend'"
    echo "pm2 save"
    echo "pm2 startup"
    echo ""
    echo "# Setup Nginx (see DEPLOYMENT.md for config)"
    echo "sudo nano /etc/nginx/sites-available/votely"
    echo "sudo ln -s /etc/nginx/sites-available/votely /etc/nginx/sites-enabled/"
    echo "sudo nginx -t"
    echo "sudo systemctl reload nginx"
}

# Function for Docker deployment
deploy_docker() {
    echo "🐳 Docker Deployment"
    echo "===================="
    echo ""
    echo "Run these commands:"
    echo ""
    echo "# Build and run with Docker Compose"
    echo "docker-compose up -d"
    echo ""
    echo "# View logs"
    echo "docker-compose logs -f backend"
    echo ""
    echo "# Stop services"
    echo "docker-compose down"
    echo ""
    echo "# Rebuild and restart"
    echo "docker-compose up -d --build"
    echo ""
    echo "# View running containers"
    echo "docker-compose ps"
    echo ""
    echo "# Access MongoDB shell"
    echo "docker-compose exec mongo mongosh -u admin -p password"
}

# Function for Heroku deployment
deploy_heroku() {
    echo "🦸 Heroku Deployment"
    echo "====================="
    echo ""
    echo "Run these commands:"
    echo ""
    echo "# Install Heroku CLI"
    echo "curl https://cli-assets.heroku.com/install.sh | sh"
    echo ""
    echo "# Login to Heroku"
    echo "heroku login"
    echo ""
    echo "# Create app"
    echo "heroku create your-votely-backend"
    echo ""
    echo "# Set environment variables"
    echo "heroku config:set NODE_ENV=production"
    echo "heroku config:set SESSION_SECRET=your_secret_here"
    echo "heroku config:set JWT_SECRET=your_jwt_secret_here"
    echo "heroku config:set MONGO_URI=your_mongodb_uri"
    echo "heroku config:set FRONTEND_ORIGIN=https://yourdomain.com"
    echo "heroku config:set ALLOWED_ORIGINS=https://yourdomain.com"
    echo ""
    echo "# Deploy"
    echo "git push heroku main"
    echo ""
    echo "# Open app"
    echo "heroku open"
    echo ""
    echo "# View logs"
    echo "heroku logs --tail"
}

# Function for Railway deployment
deploy_railway() {
    echo "🚂 Railway Deployment"
    echo "====================="
    echo ""
    echo "Run these commands:"
    echo ""
    echo "# Install Railway CLI"
    echo "npm install -g @railway/cli"
    echo ""
    echo "# Login to Railway"
    echo "railway login"
    echo ""
    echo "# Initialize project"
    echo "railway init"
    echo ""
    echo "# Set environment variables"
    echo "railway variables set NODE_ENV=production"
    echo "railway variables set SESSION_SECRET=your_secret_here"
    echo "railway variables set JWT_SECRET=your_jwt_secret_here"
    echo "railway variables set MONGO_URI=your_mongodb_uri"
    echo "railway variables set FRONTEND_ORIGIN=https://yourdomain.com"
    echo "railway variables set ALLOWED_ORIGINS=https://yourdomain.com"
    echo ""
    echo "# Deploy"
    echo "railway up"
    echo ""
    echo "# View logs"
    echo "railway logs"
}

# Function for DigitalOcean App Platform
deploy_digitalocean() {
    echo "🌊 DigitalOcean App Platform"
    echo "============================="
    echo ""
    echo "1. Go to DigitalOcean App Platform"
    echo "2. Create new app from GitHub repository"
    echo "3. Select your votely backend repository"
    echo "4. Set build command: npm install --production"
    echo "5. Set run command: npm start"
    echo "6. Add environment variables:"
    echo "   - NODE_ENV=production"
    echo "   - SESSION_SECRET=your_secret_here"
    echo "   - JWT_SECRET=your_jwt_secret_here"
    echo "   - MONGO_URI=your_mongodb_uri"
    echo "   - FRONTEND_ORIGIN=https://yourdomain.com"
    echo "   - ALLOWED_ORIGINS=https://yourdomain.com"
    echo "7. Deploy app"
}

# Function for AWS Elastic Beanstalk
deploy_aws() {
    echo "☁️  AWS Elastic Beanstalk"
    echo "=========================="
    echo ""
    echo "1. Install AWS CLI and EB CLI"
    echo "2. Configure AWS credentials"
    echo "3. Initialize EB application:"
    echo "   eb init -p node.js votely-backend"
    echo "4. Create environment:"
    echo "   eb create votely-backend-prod"
    echo "5. Set environment variables:"
    echo "   eb setenv NODE_ENV=production"
    echo "   eb setenv SESSION_SECRET=your_secret_here"
    echo "   eb setenv JWT_SECRET=your_jwt_secret_here"
    echo "   eb setenv MONGO_URI=your_mongodb_uri"
    echo "6. Deploy:"
    echo "   eb deploy"
}

# Function for Google Cloud Run
deploy_gcp() {
    echo "☁️  Google Cloud Run"
    echo "====================="
    echo ""
    echo "1. Install Google Cloud CLI"
    echo "2. Authenticate: gcloud auth login"
    echo "3. Set project: gcloud config set project YOUR_PROJECT_ID"
    echo "4. Build and push image:"
    echo "   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/votely-backend"
    echo "5. Deploy to Cloud Run:"
    echo "   gcloud run deploy votely-backend \\"
    echo "     --image gcr.io/YOUR_PROJECT_ID/votely-backend \\"
    echo "     --platform managed \\"
    echo "     --region us-central1 \\"
    echo "     --allow-unauthenticated \\"
    echo "     --set-env-vars NODE_ENV=production"
}

# Main menu loop
while true; do
    show_platforms
    read -p "Select a platform (1-8): " choice
    
    case $choice in
        1)
            deploy_vps
            ;;
        2)
            deploy_docker
            ;;
        3)
            deploy_heroku
            ;;
        4)
            deploy_railway
            ;;
        5)
            deploy_digitalocean
            ;;
        6)
            deploy_aws
            ;;
        7)
            deploy_gcp
            ;;
        8)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please select 1-8."
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    clear
done

