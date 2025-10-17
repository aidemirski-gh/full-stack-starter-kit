# AI Tools Hub - Full-Stack Application

A comprehensive platform to discover, organize, and manage AI tools with role-based access control. Built with Next.js, Laravel, and Docker.

## 🎯 Features

- **AI Tools Management**: Create, edit, and organize AI tools with detailed information
- **Smart Categorization**: Organize tools by types and categories
- **Role-Based Access Control**: Granular permissions system with owner, frontend, and backend roles
- **Advanced Filtering**: Filter tools by name, role, and type
- **User Management**: Manage users and their role assignments
- **Responsive Design**: Beautiful, mobile-friendly interface
- **RESTful API**: Laravel backend with Sanctum authentication

## 🚀 Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS (Port 8200)
- **Backend**: Laravel 11 + PHP 8.2 + Nginx (Port 8201)
- **Database**: MySQL 8.0 (Port 8203)
- **Cache**: Redis 7 (Port 8204)
- **Development Tools**: Alpine container (Port 8205)

## 📋 Documentation

- **[Installation Guide](docs/INSTALLATION.md)** - Complete setup instructions with Docker
- **[User Manual](docs/USER_MANUAL.md)** - How to use the application
  - Role System and Permissions
  - AI Tools Management
  - AI Tool Types Management
- **[API Documentation](docs/API.md)** - Backend API reference (optional)

## 📁 Quick Start

### Prerequisites

- Docker Desktop installed and running
- Git (for cloning the repository)
- Ports 8200-8205 available

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd full-stack-starter-kit
   ```

2. **Start the environment:**
   ```bash
   ./start.sh
   ```

3. **Access the application:**
   - Frontend: http://localhost:8200
   - Backend API: http://localhost:8201
   - API Status: http://localhost:8201/api/status

4. **Default credentials:**
   - Email: `admin@example.com`
   - Password: `password`

For detailed installation instructions, see [Installation Guide](docs/INSTALLATION.md).

## 📱 Mobile Access

Access the application from your mobile device on the same Wi-Fi network!

### Quick Setup (Windows)

**Option 1: Automatic (Recommended)**
```bash
# Run as Administrator
.\enable-mobile-access.bat
```

**Option 2: PowerShell**
```powershell
# Run as Administrator
.\enable-mobile-access.ps1
```

### Manual Setup

1. **Open Windows Firewall ports 8200 and 8201**
2. **Find your computer's IP address:** `ipconfig`
3. **Restart containers:** `docker compose down && docker compose up -d`
4. **Access from mobile:** `http://YOUR-IP:8200`

📖 **For detailed instructions, see [MOBILE_ACCESS.md](MOBILE_ACCESS.md)**

## 🎨 Key Features

### Role-Based Access Control

Three predefined roles with different permissions:

- **Owner**: Full access to all features including user and role management
- **Frontend**: Access to AI tools relevant to frontend development
- **Backend**: Access to AI tools relevant to backend development

### AI Tools Management

- Create and manage AI tools with comprehensive information
- Assign tools to specific roles for targeted access
- Categorize tools by types (e.g., Code Generation, Design, Testing)
- Filter and search tools efficiently

### User Management (Owner Only)

- Create and manage user accounts
- Assign multiple roles to users
- Activate/deactivate user accounts
- View user activity and roles

## 📁 Project Structure

```
full-stack-starter-kit/
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities and configs
│   ├── public/             # Static assets
│   └── package.json
├── backend/                # Laravel application
│   ├── app/
│   │   ├── Http/           # Controllers and Middleware
│   │   ├── Models/         # Eloquent models
│   │   └── Services/       # Business logic
│   ├── database/
│   │   ├── migrations/     # Database migrations
│   │   └── seeders/        # Database seeders
│   ├── routes/             # API routes
│   └── .env                # Environment configuration
├── docs/                   # Documentation
│   ├── INSTALLATION.md     # Installation guide
│   └── USER_MANUAL.md      # User manual
├── nginx/                  # Nginx configuration
├── docker/                 # Docker configurations
├── docker-compose.yml      # Container orchestration
└── README.md              # This file
```

## 🔧 Management Scripts

- `./start.sh` - Start all services with auto-setup
- `./stop.sh` - Stop all services
- `./laravel-setup.sh` - Full Laravel initialization
- `./db-manage.sh` - Database management utilities

## 💻 Development

### Frontend Development

```bash
# Access frontend container
docker compose exec frontend sh

# Install packages
docker compose exec frontend npm install package-name

# View logs
docker compose logs frontend -f
```

### Backend Development

```bash
# Access PHP container
docker compose exec php_fpm sh

# Laravel Artisan commands
docker compose exec php_fpm php artisan migrate
docker compose exec php_fpm php artisan make:controller ControllerName

# Composer commands
docker compose exec php_fpm composer install
```

### Database Operations

```bash
# Connect to MySQL
./db-manage.sh connect

# Create backup
./db-manage.sh backup

# Connect to Redis
./db-manage.sh redis
```

## 🔐 Configuration

### Database Credentials

- **Host**: mysql (internal) / localhost:8203 (external)
- **Database**: vibecode-full-stack-starter-kit_app
- **Username**: root
- **Password**: vibecode-full-stack-starter-kit_mysql_pass

### Redis Configuration

- **Host**: redis (internal) / localhost:8204 (external)
- **Password**: vibecode-full-stack-starter-kit_redis_pass

## 🛠️ Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Check if ports 8200-8205 are available
   - Use `netstat -tulpn | grep :PORT` to check port usage

2. **Permission issues:**
   - Run `./laravel-setup.sh` to fix Laravel permissions

3. **Services not starting:**
   - Check Docker is running: `docker ps`
   - View logs: `docker compose logs`

### Useful Commands

```bash
# Check service status
docker compose ps

# View all logs
docker compose logs -f

# Restart specific service
docker compose restart frontend

# Rebuild services
docker compose up -d --build

# Clean up (removes containers and volumes)
docker compose down -v
```

## 📊 Monitoring

- **Service Status**: `docker compose ps`
- **Resource Usage**: `docker stats`
- **Logs**: `docker compose logs -f [service_name]`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the [User Manual](docs/USER_MANUAL.md)
- Check the [Installation Guide](docs/INSTALLATION.md)
- Review existing issues in the repository
- Create a new issue with detailed information

---

**Built with ❤️ using Next.js, Laravel, and Docker**
