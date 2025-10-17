# Installation Guide - AI Tools Hub

This guide will walk you through the complete installation process of the AI Tools Hub application using Docker.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [First-Time Setup](#first-time-setup)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)
7. [Mobile Access Setup](#mobile-access-setup)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Docker Desktop**
   - Windows: Download from [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
   - Mac: Download from [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
   - Linux: Install Docker Engine and Docker Compose
   - Minimum version: Docker 20.10+, Docker Compose 2.0+

2. **Git** (optional, for cloning)
   - Download from [git-scm.com](https://git-scm.com/)

3. **System Requirements**
   - RAM: Minimum 4GB (8GB recommended)
   - Disk Space: Minimum 5GB free space
   - Ports: 8200-8205 must be available

### Verify Prerequisites

```bash
# Check Docker version
docker --version
# Expected: Docker version 20.10.0 or higher

# Check Docker Compose version
docker compose version
# Expected: Docker Compose version 2.0.0 or higher

# Check if Docker is running
docker ps
# Should show a list of running containers (may be empty)
```

## Installation Steps

### Step 1: Get the Source Code

**Option A: Clone from Git**
```bash
git clone <repository-url>
cd full-stack-starter-kit
```

**Option B: Download and Extract**
1. Download the project ZIP file
2. Extract to your desired location
3. Open terminal/command prompt in the extracted folder

### Step 2: Verify Project Structure

Ensure the following directories and files exist:

```
full-stack-starter-kit/
├── frontend/
├── backend/
├── docker-compose.yml
├── start.sh
├── stop.sh
├── laravel-setup.sh
└── db-manage.sh
```

### Step 3: Start the Application

**On Linux/Mac:**
```bash
# Make scripts executable
chmod +x start.sh stop.sh laravel-setup.sh db-manage.sh

# Start the application
./start.sh
```

**On Windows (PowerShell):**
```powershell
# Start the application
.\start.sh
```

**On Windows (Command Prompt):**
```cmd
bash start.sh
```

The `start.sh` script will automatically:
- Start all Docker containers
- Install frontend dependencies
- Set up Laravel backend
- Run database migrations
- Seed initial data

**Expected Output:**
```
Starting AI Tools Hub...
Creating network...
Starting services...
Setting up frontend...
Setting up backend...
Running migrations...
Seeding database...
✓ All services started successfully!

Frontend: http://localhost:8200
Backend:  http://localhost:8201
```

### Step 4: Wait for Services to Start

The first run may take 5-10 minutes to download Docker images and set up the environment.

Monitor the progress:
```bash
# Check service status
docker compose ps

# View logs
docker compose logs -f
```

## Configuration

### Environment Variables

The application uses environment variables for configuration. Default values are set, but you can customize them.

#### Backend Configuration (`backend/.env`)

Key settings:
```env
APP_NAME="AI Tools Hub"
APP_URL=http://localhost:8201

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=vibecode-full-stack-starter-kit_app
DB_USERNAME=root
DB_PASSWORD=vibecode-full-stack-starter-kit_mysql_pass

REDIS_HOST=redis
REDIS_PASSWORD=vibecode-full-stack-starter-kit_redis_pass
REDIS_PORT=6379

FRONTEND_URL=http://localhost:8200
```

#### Frontend Configuration

The frontend automatically detects the API URL. To customize:

Edit `frontend/src/lib/config.ts`:
```typescript
export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://localhost:8201/api`;
  }
  return 'http://backend/api';
};
```

### Port Configuration

If ports 8200-8205 are already in use, you can modify them in `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "YOUR_PORT:3000"  # Change 8200 to your preferred port

  backend:
    ports:
      - "YOUR_PORT:80"    # Change 8201 to your preferred port
```

After changing ports, rebuild containers:
```bash
docker compose down
docker compose up -d --build
```

## First-Time Setup

### Default User Accounts

The application seeds three default user accounts:

| Email | Password | Role | Status |
|-------|----------|------|--------|
| admin@example.com | password | Owner | Active |
| frontend@example.com | password | Frontend | Active |
| backend@example.com | password | Backend | Active |

**Security Note:** Change these passwords immediately after first login!

### Initial Login

1. Open your browser and navigate to `http://localhost:8200`
2. Click "Sign In" or navigate to `http://localhost:8200/login`
3. Enter credentials:
   - Email: `admin@example.com`
   - Password: `password`
4. You will be redirected to the Dashboard

### Change Default Passwords

1. Log in as admin
2. Navigate to "Users & Roles" from the sidebar
3. Click on each user
4. Update their information and passwords
5. Save changes

## Verification

### Verify Services are Running

```bash
# Check all services
docker compose ps

# Should show:
# NAME                          STATUS    PORTS
# frontend                      Up        0.0.0.0:8200->3000/tcp
# backend                       Up        0.0.0.0:8201->80/tcp
# php_fpm                       Up        9000/tcp
# mysql                         Up        0.0.0.0:8203->3306/tcp
# redis                         Up        0.0.0.0:8204->6379/tcp
```

### Test Frontend

Visit `http://localhost:8200` - You should see the AI Tools Hub homepage.

### Test Backend API

Visit `http://localhost:8201/api/status` - You should see:
```json
{
  "status": "ok",
  "message": "API is running"
}
```

### Test Database Connection

```bash
# Connect to MySQL
./db-manage.sh connect

# Once connected, run:
SHOW TABLES;

# You should see tables like:
# - users
# - roles
# - ai_tools
# - ai_tools_types
# etc.

# Exit MySQL
exit
```

### Test Authentication

1. Log in with default credentials
2. Navigate to Dashboard
3. Check if your name appears in the sidebar
4. Try navigating to different pages (AI Tools, AI Tool Types)

## Troubleshooting

### Issue: Port Already in Use

**Problem:** Error: `Bind for 0.0.0.0:8200 failed: port is already allocated`

**Solution:**
```bash
# Find what's using the port
# Windows
netstat -ano | findstr :8200

# Linux/Mac
lsof -i :8200

# Stop the conflicting service or change ports in docker-compose.yml
```

### Issue: Docker Not Running

**Problem:** `Cannot connect to the Docker daemon`

**Solution:**
1. Start Docker Desktop
2. Wait for Docker to fully start (check system tray icon)
3. Retry: `./start.sh`

### Issue: Permission Denied (Linux)

**Problem:** `Permission denied` when running scripts

**Solution:**
```bash
# Make scripts executable
chmod +x start.sh stop.sh laravel-setup.sh db-manage.sh

# Run the script
./start.sh
```

### Issue: Frontend Not Loading

**Problem:** Frontend shows blank page or connection errors

**Solution:**
```bash
# Check frontend logs
docker compose logs frontend -f

# Restart frontend service
docker compose restart frontend

# If issues persist, rebuild
docker compose up -d --build frontend
```

### Issue: Backend API Errors

**Problem:** API returns 500 errors or doesn't respond

**Solution:**
```bash
# Check backend logs
docker compose logs backend -f
docker compose logs php_fpm -f

# Clear Laravel cache
docker compose exec php_fpm php artisan cache:clear
docker compose exec php_fpm php artisan config:clear

# Restart backend
docker compose restart backend php_fpm
```

### Issue: Database Connection Failed

**Problem:** `SQLSTATE[HY000] [2002] Connection refused`

**Solution:**
```bash
# Check MySQL is running
docker compose ps mysql

# Wait for MySQL to be ready (may take 30-60 seconds on first run)
docker compose logs mysql -f

# Restart MySQL
docker compose restart mysql

# Re-run migrations
docker compose exec php_fpm php artisan migrate
```

### Issue: Seeder Errors

**Problem:** Error during database seeding

**Solution:**
```bash
# Reset database and re-seed
docker compose exec php_fpm php artisan migrate:fresh --seed

# Or seed specific seeders
docker compose exec php_fpm php artisan db:seed --class=RoleSeeder
docker compose exec php_fpm php artisan db:seed --class=UserSeeder
```

### Complete Reset

If you encounter persistent issues, perform a complete reset:

```bash
# Stop all services
docker compose down

# Remove volumes (WARNING: This deletes all data!)
docker compose down -v

# Remove images (optional)
docker compose down --rmi all

# Start fresh
./start.sh
```

## Mobile Access Setup

To access the application from your mobile device on the same network:

### Windows - Automatic Setup

```bash
# Run as Administrator
.\enable-mobile-access.bat
```

Or use PowerShell:
```powershell
# Run as Administrator
.\enable-mobile-access.ps1
```

### Manual Setup (All Platforms)

1. **Find your computer's IP address:**

   **Windows:**
   ```cmd
   ipconfig
   # Look for "IPv4 Address" under your active network adapter
   ```

   **Mac/Linux:**
   ```bash
   ifconfig
   # or
   ip addr show
   ```

2. **Configure Firewall:**

   **Windows:**
   - Open Windows Defender Firewall
   - Click "Advanced settings"
   - Add inbound rules for ports 8200 and 8201

   **Mac:**
   - System Preferences → Security & Privacy → Firewall
   - Add rules for ports 8200 and 8201

   **Linux:**
   ```bash
   sudo ufw allow 8200
   sudo ufw allow 8201
   ```

3. **Update Docker Compose** (if needed):

   Edit `docker-compose.yml` to bind to all interfaces:
   ```yaml
   frontend:
     ports:
       - "0.0.0.0:8200:3000"

   backend:
     ports:
       - "0.0.0.0:8201:80"
   ```

4. **Restart containers:**
   ```bash
   docker compose down
   docker compose up -d
   ```

5. **Access from mobile:**
   - Open browser on mobile device
   - Navigate to `http://YOUR-IP:8200`
   - Example: `http://192.168.1.100:8200`

## Next Steps

After successful installation:

1. **Read the User Manual**: Check [USER_MANUAL.md](USER_MANUAL.md) for detailed usage instructions
2. **Change Default Passwords**: Update all default user passwords
3. **Create Additional Users**: Set up user accounts for your team
4. **Add AI Tools**: Start populating the database with AI tools
5. **Configure Roles**: Customize role permissions as needed

## Additional Resources

- **Project README**: [README.md](../README.md)
- **User Manual**: [USER_MANUAL.md](USER_MANUAL.md)
- **Docker Documentation**: [docs.docker.com](https://docs.docker.com)
- **Laravel Documentation**: [laravel.com/docs](https://laravel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)

## Getting Help

If you encounter issues not covered in this guide:

1. Check the logs: `docker compose logs -f`
2. Review the [Troubleshooting](#troubleshooting) section
3. Search for similar issues in the project repository
4. Create a detailed issue report with:
   - Error messages
   - Steps to reproduce
   - System information
   - Log output

---

**Installation complete!** You're ready to start using AI Tools Hub. 🎉
