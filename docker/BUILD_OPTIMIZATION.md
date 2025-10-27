# PHP Docker Build Optimization Guide

## Problem
The original Dockerfile compiles PHP extensions from source, which takes 2-5 minutes on each build.

## Solutions (Fastest to Slowest)

### Option 1: Pre-built Laravel Image (FASTEST) ⚡
**Build time: ~10 seconds**

Use [docker/Dockerfile.php.fastest](Dockerfile.php.fastest)

```dockerfile
FROM serversideup/php:8.2-fpm-alpine
```

**Pros:**
- 10-30x faster build times
- All Laravel extensions pre-installed
- Well-maintained community image
- Optimized for production

**Cons:**
- External dependency (not official PHP image)
- Slightly larger image size

**How to use:**
```bash
# Backup current Dockerfile
cp docker/Dockerfile.php docker/Dockerfile.php.backup

# Use the fastest version
cp docker/Dockerfile.php.fastest docker/Dockerfile.php

# Rebuild
docker compose build php_fpm --no-cache
docker compose up -d
```

### Option 2: Optimized Official Image (RECOMMENDED) ✅
**Build time: ~1-2 minutes (5-10 seconds on rebuild with cache)**

Use [docker/Dockerfile.php.optimized](Dockerfile.php.optimized)

**Improvements made:**
1. Better layer caching strategy
2. Combined RUN commands to reduce layers
3. Parallel compilation with `-j$(nproc)`
4. Separated rarely-changing dependencies
5. Cleanup of build artifacts

**Pros:**
- Uses official PHP image (better security/trust)
- Good caching - rebuilds are very fast
- Smaller final image size
- Full control over extensions

**Cons:**
- First build still takes 1-2 minutes
- Requires rebuilding on PHP version changes

**How to use:**
```bash
# Backup current Dockerfile
cp docker/Dockerfile.php docker/Dockerfile.php.backup

# Use the optimized version
cp docker/Dockerfile.php.optimized docker/Dockerfile.php

# Rebuild
docker compose build php_fpm --no-cache
docker compose up -d
```

### Option 3: Enable BuildKit Cache (Works with Any Dockerfile) 🚀
**Build time: First build normal, subsequent builds 80% faster**

Enable Docker BuildKit for better caching:

**Windows (PowerShell):**
```powershell
$env:DOCKER_BUILDKIT=1
$env:COMPOSE_DOCKER_CLI_BUILD=1
docker compose build php_fpm
```

**Windows (Batch):**
```batch
set DOCKER_BUILDKIT=1
set COMPOSE_DOCKER_CLI_BUILD=1
docker compose build php_fpm
```

**Linux/Mac:**
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
docker compose build php_fpm
```

**Make it permanent** - Add to [docker-compose.yml](../docker-compose.yml):
```yaml
services:
  php_fpm:
    build:
      context: .
      dockerfile: docker/Dockerfile.php
      cache_from:
        - vibecode-full-stack-starter-kit_php_laravel:latest
```

### Option 4: Use Multi-Stage Build with Cache Mount
**Build time: ~30 seconds**

Add this to Dockerfile.php:

```dockerfile
# syntax=docker/dockerfile:1.4
FROM php:8.2-fpm-alpine

# Use BuildKit cache mounts for package managers
RUN --mount=type=cache,target=/var/cache/apk \
    apk add --no-cache ...

RUN --mount=type=cache,target=/tmp/pear \
    pecl install redis
```

## Comparison Table

| Solution | First Build | Rebuild | Image Size | Security | Difficulty |
|----------|-------------|---------|------------|----------|------------|
| Pre-built Image | 10s | 5s | ~120MB | Good | Easy |
| Optimized Official | 90s | 10s | ~100MB | Excellent | Easy |
| Current (Original) | 180s | 180s | ~110MB | Excellent | Easy |
| BuildKit Cache | 180s | 30s | ~110MB | Excellent | Medium |

## Recommendations

### For Development (Daily Use):
Use **Option 1 (Pre-built Image)** - Fastest iteration time

### For Production:
Use **Option 2 (Optimized Official)** - Best security and control

### For CI/CD:
Use **Option 2 + BuildKit Cache** - Fast builds with official images

## Testing Your Changes

After switching Dockerfiles:

```bash
# Stop and remove existing containers
docker compose down

# Rebuild with no cache to test
docker compose build php_fpm --no-cache --progress=plain

# Start services
docker compose up -d

# Verify extensions are loaded
docker compose exec php_fpm php -m

# Check for these extensions:
# - pdo_mysql
# - mysqli
# - redis
# - gd
# - zip
# - bcmath
# - pcntl
```

## Troubleshooting

### Build fails with pre-built image:
```bash
# Image might not be available, use optimized version instead
cp docker/Dockerfile.php.optimized docker/Dockerfile.php
```

### Extensions missing after rebuild:
```bash
# Clear all build cache
docker builder prune -af

# Rebuild completely
docker compose build php_fpm --no-cache
```

### Still slow after optimization:
```bash
# Check if BuildKit is enabled
docker buildx version

# Enable BuildKit permanently (add to ~/.bashrc or ~/.zshrc)
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

## Additional Optimizations

### 1. Use Docker Layer Caching in CI/CD
```yaml
# GitHub Actions example
- name: Build
  uses: docker/build-push-action@v4
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### 2. Pre-pull Base Images
```bash
# Pull base image before building
docker pull php:8.2-fpm-alpine
docker compose build php_fpm
```

### 3. Use Docker Compose Build Cache
```yaml
# In docker-compose.yml
services:
  php_fpm:
    build:
      cache_from:
        - ${DOCKER_REGISTRY}/php_laravel:latest
```

## Questions?

- Check Docker BuildKit docs: https://docs.docker.com/build/buildkit/
- Server Side Up PHP Images: https://github.com/serversideup/docker-php
