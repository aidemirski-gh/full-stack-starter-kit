# AI Vibecoding Academy - Laravel PHP Dockerfile
# FASTEST VERSION - Uses pre-built Laravel-optimized image
# Build time: ~10 seconds vs ~2-5 minutes with compilation

FROM serversideup/php:8.2-fpm-alpine

LABEL project="AI Vibecoding Academy Starter Kit"
LABEL maintainer="AI Vibecoding Academy"

# This image already includes:
# - PHP 8.2 FPM
# - Common extensions: pdo_mysql, mysqli, redis, gd, zip, bcmath, opcache, etc.
# - Composer
# - Proper user permissions

# Switch to root to install additional packages
USER root

# Install only the additional tools we need
RUN apk add --no-cache \
    supervisor \
    nginx \
    mysql-client

# Copy project-specific configurations
COPY docker/php.ini /usr/local/etc/php/conf.d/project.ini
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set working directory
WORKDIR /var/www/html

# The image uses www-data user by default, adjust permissions
RUN chown -R www-data:www-data /var/www

# Switch to www-data user (equivalent to laravel user)
USER www-data

# Expose PHP-FPM port
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
