# Redis Caching Implementation

This document describes the Redis caching implementation for AI Tools Types and Tool Counts.

## Overview

Redis caching has been implemented to improve performance by reducing database queries for frequently accessed data. The implementation focuses on:

1. **AI Tools Types List with Tool Counts** - Cached for 1 hour
2. **Automatic Cache Invalidation** - When AI tools or types are modified

## Components

### 1. CacheService

**Location**: `backend/app/Services/CacheService.php`

A centralized service for handling Redis cache operations:

- `remember($key, $callback, $ttl)` - Get cached data or execute callback and cache result
- `forget($key)` - Invalidate cache by key
- `forgetMultiple($keys)` - Invalidate multiple cache keys
- `clearPrefix($prefix)` - Clear all cache keys with a specific prefix

**Features**:
- Default TTL: 3600 seconds (1 hour)
- Automatic error handling with fallback to direct execution
- Logging for cache hits/misses and invalidations
- Support for Redis pattern matching

### 2. AI Tools Types Controller

**Location**: `backend/app/Http/Controllers/Api/AiToolsTypeController.php`

**Cached Endpoints**:

#### GET /api/ai-tools-types
- Returns all AI tools types with tool counts
- **Cache Key**: `ai_tools_types:with_counts`
- **TTL**: 1 hour (3600 seconds)
- **Response includes**: `tools_count` field for each type

#### POST /api/ai-tools-types
- Creates a new AI tools type
- **Automatically invalidates**: `ai_tools_types:with_counts` cache

#### POST /api/ai-tools-types/clear-cache (Owner only)
- Manually clears the AI tools types cache
- Useful for testing or forcing cache refresh

### 3. AI Tools Controller

**Location**: `backend/app/Http/Controllers/Api/AiToolController.php`

All CRUD operations automatically invalidate the AI tools types cache:

#### POST /api/ai-tools (Create)
- Invalidates cache after creating a new AI tool
- Updates tool counts for associated types

#### PUT /api/ai-tools/{id} (Update)
- Invalidates cache after updating an AI tool
- Refreshes tool counts if types are changed

#### DELETE /api/ai-tools/{id} (Delete)
- Invalidates cache after deleting an AI tool
- Updates tool counts for previously associated types

### 4. Frontend Integration

**Location**: `frontend/src/app/ai-tools-types/page.tsx`

The frontend has been updated to display the cached tool counts:

- New column "Tools Count" added to the table
- Displays count with badge styling
- Interface updated to include `tools_count` field

## Tool Count Logic

The system handles both legacy (one-to-many) and new (many-to-many) relationships:

```php
$legacyCount = $type->ai_tools_count ?? 0;
$manyToManyCount = $type->ai_tools_many_count ?? 0;
$totalCount = max($legacyCount, $manyToManyCount);
```

This ensures accurate counts regardless of which relationship model is used.

## Configuration

### Redis Settings (docker-compose.yml)

```yaml
redis:
  image: redis:7-alpine
  ports:
    - "8204:6379"
  command: redis-server --appendonly yes --requirepass "vibecode-full-stack-starter-kit_redis_pass"
```

### Laravel Cache Configuration (.env)

```env
CACHE_DRIVER=redis
CACHE_STORE=redis
REDIS_CLIENT=phpredis
REDIS_HOST=redis
REDIS_PASSWORD=vibecode-full-stack-starter-kit_redis_pass
REDIS_PORT=6379
```

## Cache Flow

### 1. First Request (Cache Miss)
1. Client requests `/api/ai-tools-types`
2. Cache is empty - callback executes
3. Database queries for types with tool counts
4. Result is stored in Redis with 1-hour TTL
5. Response returned to client

### 2. Subsequent Requests (Cache Hit)
1. Client requests `/api/ai-tools-types`
2. Data retrieved directly from Redis
3. No database queries needed
4. Response returned instantly

### 3. Cache Invalidation
When any AI tool is created, updated, or deleted:
1. CRUD operation completes
2. `CacheService::forget('ai_tools_types:with_counts')` called
3. Cache cleared immediately
4. Next request will be a cache miss and rebuild the cache

## Benefits

1. **Performance**: Reduces database load for frequently accessed endpoints
2. **Scalability**: Handles high traffic without overwhelming the database
3. **Automatic**: No manual intervention needed - cache invalidates automatically
4. **Flexible**: Easy to add caching to other endpoints
5. **Resilient**: Falls back to database if cache fails

## Testing Cache

### Test Cache Hit
```bash
# First request (cache miss)
curl http://localhost:8201/api/ai-tools-types

# Check Laravel logs for: "Cache miss for key: ai_tools_types:with_counts"

# Second request (cache hit)
curl http://localhost:8201/api/ai-tools-types

# Should be faster, no database queries
```

### Test Cache Invalidation
```bash
# Create a new AI tool
curl -X POST http://localhost:8201/api/ai-tools \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Tool", ...}'

# Check logs for: "Cache invalidated after creating AI tool"

# Next request will rebuild cache
curl http://localhost:8201/api/ai-tools-types
```

### Manual Cache Clear
```bash
curl -X POST http://localhost:8201/api/ai-tools-types/clear-cache \
  -H "Authorization: Bearer OWNER_TOKEN"
```

### Check Redis Directly
```bash
# Connect to Redis
docker exec -it vibecode-full-stack-starter-kit_redis redis-cli -a "vibecode-full-stack-starter-kit_redis_pass"

# List all cache keys
KEYS app_cache:*

# Get cached value
GET app_cache:ai_tools_types:with_counts

# Delete cache key
DEL app_cache:ai_tools_types:with_counts
```

## Monitoring

All cache operations are logged with Laravel's logging system:

- **Cache Miss**: "Cache miss for key: {key}"
- **Cache Invalidation**: "Cache invalidated for key: {key}"
- **Cache Clear**: "Cache cleared for prefix: {prefix}"
- **Errors**: "Cache error for key {key}: {message}"

Check logs in `backend/storage/logs/laravel.log` or Docker logs:

```bash
docker logs vibecode-full-stack-starter-kit_php_fpm -f
```

## Future Enhancements

1. Add caching to AI tools list endpoint
2. Implement cache warming on application startup
3. Add cache statistics endpoint
4. Use Redis for session storage (already configured)
5. Implement cache tags for more granular invalidation

## Troubleshooting

### Cache Not Working
1. Check Redis is running: `docker ps | grep redis`
2. Verify `.env` has correct Redis settings
3. Test Redis connection: `docker exec vibecode-full-stack-starter-kit_redis redis-cli -a "password" ping`
4. Check Laravel logs for cache errors

### Stale Data
1. Manually clear cache: `POST /api/ai-tools-types/clear-cache`
2. Restart PHP-FPM container: `docker restart vibecode-full-stack-starter-kit_php_fpm`
3. Verify cache invalidation is triggered on CRUD operations

### Performance Issues
1. Check cache hit rate in logs
2. Adjust TTL if needed (currently 1 hour)
3. Monitor Redis memory usage
4. Consider increasing Redis max memory if needed
