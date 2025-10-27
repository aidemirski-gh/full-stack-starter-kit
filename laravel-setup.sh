#!/bin/bash
echo "🔧 Full Laravel initialization..."

# Check if services are running
if ! docker compose ps | grep -q "Up"; then
    echo "❌ Services not running. Please run ./start.sh first"
    exit 1
fi

# Install Composer dependencies
echo "📦 Installing Composer dependencies..."
docker compose exec php_fpm composer install --no-interaction

# Generate application key
echo "🔑 Generating application key..."
docker compose exec php_fpm php artisan key:generate

# Run database migrations
echo "🗄️ Running database migrations..."
docker compose exec php_fpm php artisan migrate --force

# Check if database has been seeded (check if roles exist)
ROLES_COUNT=$(docker compose exec -T php_fpm php artisan tinker --execute="echo \App\Models\Role::count();" 2>/dev/null | tail -1)

if [ "$ROLES_COUNT" -eq "0" ] 2>/dev/null; then
    echo "🌱 Database is empty, seeding with initial data..."
    docker compose exec php_fpm php artisan db:seed --force
else
    echo "📊 Database already seeded (found $ROLES_COUNT roles)"
    read -p "🌱 Do you want to re-seed the database? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker compose exec php_fpm php artisan db:seed --force
    fi
fi

# Clear and cache configurations
echo "🧹 Optimizing Laravel..."
docker compose exec php_fpm php artisan config:clear
docker compose exec php_fpm php artisan route:clear
docker compose exec php_fpm php artisan view:clear
docker compose exec php_fpm php artisan config:cache
docker compose exec php_fpm php artisan route:cache

# Set proper permissions (use root user)
echo "🔒 Setting proper permissions..."
docker compose exec -u root php_fpm chmod -R 777 /var/www/html/storage
docker compose exec -u root php_fpm chmod -R 777 /var/www/html/bootstrap/cache

echo "✅ Laravel initialization complete!"
