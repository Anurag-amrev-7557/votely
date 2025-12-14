# Votely Backend Deployment Checklist

## Pre-Deployment Checklist

### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `SESSION_SECRET` - Strong, unique secret (32+ characters)
- [ ] `JWT_SECRET` - Strong, unique secret (32+ characters)
- [ ] `MONGO_URI` - Production MongoDB connection string
- [ ] `FRONTEND_ORIGIN` - Your production frontend URL
- [ ] `ALLOWED_ORIGINS` - Comma-separated list of allowed origins

### Security Configuration
- [ ] HTTPS enabled on your domain
- [ ] Strong, unique secrets (not default values)
- [ ] CORS configured for production domains only
- [ ] Environment variables not committed to version control
- [ ] Database access restricted to application only

### Database Setup
- [ ] Production MongoDB instance running
- [ ] Database user with appropriate permissions
- [ ] Connection string tested and working
- [ ] Database backup strategy in place
- [ ] Indexes created for performance

### File Storage
- [ ] Uploads directory created with proper permissions
- [ ] File size limits configured appropriately
- [ ] Storage space sufficient for expected usage
- [ ] Backup strategy for uploaded files

## Deployment Steps

### 1. Server Preparation
- [ ] Node.js 18+ installed
- [ ] PM2 installed (for process management)
- [ ] Nginx installed (for reverse proxy)
- [ ] Firewall configured
- [ ] SSL certificate obtained and configured

### 2. Application Deployment
- [ ] Code deployed to production server
- [ ] Dependencies installed (`npm install --production`)
- [ ] Environment variables set
- [ ] Application started with PM2
- [ ] PM2 configured to start on boot

### 3. Reverse Proxy Setup
- [ ] Nginx configuration created
- [ ] SSL certificate configured
- [ ] Proxy rules set up
- [ ] Static file serving configured
- [ ] Nginx configuration tested

### 4. Domain Configuration
- [ ] DNS records pointing to your server
- [ ] SSL certificate valid for your domain
- [ ] Frontend configured to use production API
- [ ] CORS origins updated with production domain

## Post-Deployment Testing

### 1. Basic Functionality
- [ ] Health check endpoint accessible (`/api/admin/health`)
- [ ] Test endpoint working (`/api/test/poll`)
- [ ] Database connection successful
- [ ] File uploads working
- [ ] Static files serving correctly

### 2. Authentication
- [ ] User registration working
- [ ] User login working
- [ ] JWT tokens being issued
- [ ] Protected routes accessible
- [ ] Session management working

### 3. Core Features
- [ ] Poll creation working
- [ ] Poll voting working
- [ ] Real-time updates working
- [ ] Admin dashboard accessible
- [ ] Email notifications working (if enabled)

### 4. Performance
- [ ] Response times acceptable
- [ ] Database queries optimized
- [ ] File uploads completing successfully
- [ ] Memory usage stable
- [ ] CPU usage reasonable

## Monitoring Setup

### 1. Logging
- [ ] Application logs being generated
- [ ] Error logs being captured
- [ ] Access logs configured
- [ ] Log rotation set up
- [ ] Log monitoring in place

### 2. Health Monitoring
- [ ] Health check endpoints responding
- [ ] Database connection monitoring
- [ ] File system monitoring
- [ ] Process monitoring (PM2)
- [ ] Alerting configured

### 3. Performance Monitoring
- [ ] Response time monitoring
- [ ] Database query monitoring
- [ ] Memory usage monitoring
- [ ] CPU usage monitoring
- [ ] Error rate monitoring

## Security Verification

### 1. Network Security
- [ ] Only necessary ports open
- [ ] Firewall rules configured
- [ ] SSH access secured
- [ ] Database access restricted
- [ ] SSL/TLS properly configured

### 2. Application Security
- [ ] CORS properly configured
- [ ] Input validation working
- [ ] SQL injection protection
- [ ] XSS protection enabled
- [ ] CSRF protection enabled

### 3. Data Security
- [ ] Sensitive data encrypted
- [ ] Passwords properly hashed
- [ ] JWT tokens secure
- [ ] Session data protected
- [ ] File uploads validated

## Backup and Recovery

### 1. Database Backups
- [ ] Automated backup schedule
- [ ] Backup retention policy
- [ ] Backup restoration tested
- [ ] Off-site backup storage
- [ ] Backup monitoring in place

### 2. Application Backups
- [ ] Code repository backed up
- [ ] Environment configuration backed up
- [ ] Uploaded files backed up
- [ ] Configuration files backed up
- [ ] Recovery procedures documented

## Documentation

### 1. Deployment Documentation
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Configuration files documented
- [ ] Troubleshooting guide created
- [ ] Contact information documented

### 2. Operational Documentation
- [ ] Monitoring procedures documented
- [ ] Backup procedures documented
- [ ] Recovery procedures documented
- [ ] Maintenance procedures documented
- [ ] Emergency procedures documented

## Final Verification

### 1. Production Readiness
- [ ] All checklist items completed
- [ ] Application tested in production environment
- [ ] Performance meets requirements
- [ ] Security requirements met
- [ ] Monitoring and alerting working

### 2. Go-Live Preparation
- [ ] Team notified of deployment
- [ ] Rollback plan prepared
- [ ] Support team briefed
- [ ] Monitoring dashboard accessible
- [ ] Emergency contacts available

## Post-Go-Live

### 1. Monitoring
- [ ] Monitor application performance
- [ ] Monitor error rates
- [ ] Monitor user feedback
- [ ] Monitor system resources
- [ ] Monitor security events

### 2. Maintenance
- [ ] Regular security updates
- [ ] Performance optimization
- [ ] Database maintenance
- [ ] Log rotation and cleanup
- [ ] Backup verification

---

**Remember**: This checklist is a starting point. Adapt it to your specific deployment requirements and add any additional items specific to your environment.

**Important**: Never deploy to production without completing all critical security and functionality checks. When in doubt, test more thoroughly.

