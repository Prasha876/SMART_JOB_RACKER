# Environment Configuration Guide

## Overview
This guide explains how to properly configure the backend environment for the Smart Job Tracker application.

## Quick Setup

1. **Copy the environment template:**
   ```bash
   copy .env.example .env
   ```

2. **Edit the `.env` file with your configuration:**
   - Update `MONGODB_URI` with your MongoDB connection string
   - Change `JWT_SECRET` to a secure random string
   - Adjust `PORT` if needed (default: 5000)
   - Set `CORS_ORIGIN` to your frontend URL

## Required Environment Variables

### Server Configuration
- **PORT**: The port number the server will run on (default: 5000)
- **NODE_ENV**: Environment mode (`development`, `production`, or `test`)

### Database Configuration
- **MONGODB_URI**: MongoDB connection string
  - Local: `mongodb://localhost:27017/smart-job-tracker`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/smart-job-tracker`

### JWT Configuration
- **JWT_SECRET**: Secret key for signing JWT tokens (MUST be changed in production)
  - Generate a secure secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **JWT_EXPIRE**: Token expiration time (default: 30d)

### CORS Configuration
- **CORS_ORIGIN**: Allowed origin for CORS (default: http://localhost:5173)
  - Development: `http://localhost:5173` (Vite default port)
  - Production: Your frontend domain (e.g., `https://yourapp.com`)

## Environment Validation

The application automatically validates required environment variables on startup:
- ✅ If all required variables are present, the server starts normally
- ❌ If any required variables are missing, the server exits with an error message

## MongoDB Connection

The application includes robust MongoDB connection handling:
- **Automatic reconnection** on connection loss
- **Detailed error messages** for common connection issues
- **Connection event logging** for monitoring

### Common MongoDB Issues

1. **Server not running**: Ensure MongoDB is installed and running
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. **Incorrect URI**: Verify your MONGODB_URI in the `.env` file

3. **Network issues**: Check firewall settings and network connectivity

## Production Deployment

### Security Checklist
- [ ] Change `JWT_SECRET` to a strong, random value
- [ ] Set `NODE_ENV=production`
- [ ] Use a secure MongoDB connection (SSL/TLS)
- [ ] Set `CORS_ORIGIN` to your production frontend URL
- [ ] Never commit `.env` file to version control
- [ ] Use environment variables in your hosting platform

### Recommended JWT Secret Generation
```bash
# Generate a secure 256-bit secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Troubleshooting

### Server won't start
1. Check if all required environment variables are set
2. Verify MongoDB is running and accessible
3. Check for port conflicts (default: 5000)

### Authentication issues
1. Verify `JWT_SECRET` is set correctly
2. Check token expiration settings
3. Ensure frontend and backend are using the same secret

### CORS errors
1. Verify `CORS_ORIGIN` matches your frontend URL
2. Check for trailing slashes in URLs
3. Ensure credentials are enabled in frontend requests

## Example .env File

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/smart-job-tracker

# JWT Configuration
JWT_SECRET=your_secure_random_secret_here_change_in_production
JWT_EXPIRE=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## Additional Resources

- [MongoDB Connection String Documentation](https://docs.mongodb.com/manual/reference/connection-string/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Express CORS Documentation](https://expressjs.com/en/resources/middleware/cors.html)
