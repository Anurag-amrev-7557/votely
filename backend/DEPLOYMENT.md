# Votely Backend Deployment Guide

## Overview
This guide will help you deploy your Votely backend to production. The backend is built with Node.js, Express, and MongoDB, and includes features like authentication, real-time updates, and file uploads.

## Prerequisites

### 1. Node.js and npm
- Node.js 18+ (LTS recommended)
- npm 8+

### 2. MongoDB Database
- MongoDB Atlas (cloud) or self-hosted MongoDB
- Database user with read/write permissions

### 3. Domain and SSL Certificate
- Production domain (e.g., api.yourdomain.com)
- SSL certificate (Let's Encrypt or paid)

### 4. Hosting Platform
- VPS (DigitalOcean, AWS EC2, etc.)
- PaaS (Heroku, Railway, etc.)
- Container platform (Docker, Kubernetes)

## Quick Start

### Option 1: Automated Setup
```bash
# Run the deployment script
npm run deploy

# Or manually
./deploy.sh
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install --production

# Copy production environment template
cp production.env.example .env

# Edit .env with your values
nano .env

# Test deployment configuration
npm run deploy:check

# Start production server
npm run deploy:prod
```

## Environment Configuration

### Required Variables
```bash
# Session Configuration
SESSION_SECRET=your_super_secret_session_key_change_this_in_production_32_chars_min

# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/votely

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_32_chars_min

# Environment
NODE_ENV=production
```

### Production URLs
```bash
# Frontend Configuration
FRONTEND_ORIGIN=https://yourdomain.com

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Optional Variables
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
```

## Deployment Methods

### 1. VPS Deployment

#### Setup Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install MongoDB (if self-hosting)
sudo apt install -y mongodb

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

#### Deploy Application
```bash
# Clone repository
git clone https://github.com/yourusername/votely.git
cd votely/backend

# Install dependencies
npm install --production

# Set environment variables
cp production.env.example .env
nano .env

# Start with PM2
pm2 start src/server.js --name "votely-backend"
pm2 save
pm2 startup
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pm;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5001

CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/votely
      - SESSION_SECRET=${SESSION_SECRET}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
    volumes:
      - ./uploads:/app/uploads

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

#### Deploy with Docker
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### 3. PaaS Deployment (Heroku/Railway)

#### Heroku
```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Create app
heroku create your-votely-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your_secret_here
heroku config:set JWT_SECRET=your_jwt_secret_here
heroku config:set MONGO_URI=your_mongodb_uri

# Deploy
git push heroku main

# Open app
heroku open
```

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Set environment variables
railway variables set NODE_ENV=production
railway variables set SESSION_SECRET=your_secret_here
railway variables set JWT_SECRET=your_jwt_secret_here
railway variables set MONGO_URI=your_mongodb_uri

# Deploy
railway up
```

## Security Configuration

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique secrets (32+ characters)
- Rotate secrets regularly

### 2. CORS Configuration
```bash
# Only allow your production domains
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. HTTPS
- Always use HTTPS in production
- Set `NODE_ENV=production` for secure cookies
- Use Let's Encrypt for free SSL certificates

### 4. Database Security
- Use strong database passwords
- Enable MongoDB authentication
- Restrict database access to your application only

## Monitoring and Maintenance

### 1. Process Management
```bash
# PM2 commands
pm2 status
pm2 logs votely-backend
pm2 restart votely-backend
pm2 monit
```

### 2. Log Management
```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log

# Rotate logs (add to crontab)
0 0 * * * logrotate /etc/logrotate.d/votely
```

### 3. Health Checks
```bash
# Test API health
curl https://api.yourdomain.com/api/admin/health

# Test database connection
curl https://api.yourdomain.com/api/test/poll
```

### 4. Backup Strategy
```bash
# MongoDB backup
mongodump --uri="mongodb://username:password@host:port/database" --out=backup/

# Application backup
tar -czf votely-backup-$(date +%Y%m%d).tar.gz uploads/ .env
```

## Troubleshooting

### Common Issues

#### 1. CORS Errors
- Check `ALLOWED_ORIGINS` configuration
- Verify frontend domain is included
- Check browser console for specific errors

#### 2. Database Connection
- Verify `MONGO_URI` is correct
- Check network/firewall settings
- Ensure MongoDB is running

#### 3. Authentication Issues
- Verify `JWT_SECRET` and `SESSION_SECRET` are set
- Check cookie settings in production
- Ensure HTTPS is enabled

#### 4. File Upload Issues
- Check uploads directory permissions
- Verify disk space
- Check file size limits

### Debug Commands
```bash
# Check deployment configuration
npm run deploy:check

# Test without authentication
curl -X POST https://api.yourdomain.com/api/test/poll \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","category":"Test","startDate":"2024-12-25T10:00:00Z","endDate":"2024-12-26T18:00:00Z","options":[{"text":"Option 1"},{"text":"Option 2"}]}'

# Check server logs
pm2 logs votely-backend --lines 100
```

## Performance Optimization

### 1. Database Optimization
- Use database indexes
- Implement connection pooling
- Monitor slow queries

### 2. Caching
- Implement Redis for session storage
- Cache frequently accessed data
- Use CDN for static files

### 3. Load Balancing
- Use multiple application instances
- Implement health checks
- Use Nginx for load balancing

## Scaling Considerations

### 1. Horizontal Scaling
- Multiple application instances
- Load balancer configuration
- Session sharing (Redis)

### 2. Database Scaling
- Read replicas
- Sharding for large datasets
- Connection pooling

### 3. File Storage
- Use cloud storage (AWS S3, Google Cloud Storage)
- CDN for static assets
- Image optimization

## Support and Resources

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

### Community
- [Stack Overflow](https://stackoverflow.com/questions/tagged/node.js)
- [Node.js Community](https://nodejs.org/en/community/)
- [MongoDB Community](https://community.mongodb.com/)

### Monitoring Tools
- [PM2](https://pm2.keymetrics.io/)
- [New Relic](https://newrelic.com/)
- [DataDog](https://www.datadoghq.com/)

## Conclusion

This deployment guide covers the essential steps to deploy your Votely backend to production. Remember to:

1. **Test thoroughly** before deploying to production
2. **Monitor your application** after deployment
3. **Keep your dependencies updated**
4. **Backup your data regularly**
5. **Document your deployment process**

For additional help, refer to the troubleshooting guides and community resources mentioned above.

