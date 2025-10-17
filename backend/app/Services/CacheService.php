<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CacheService
{
    /**
     * Cache TTL in seconds (1 hour)
     */
    const DEFAULT_TTL = 3600;

    /**
     * Cache key prefix
     */
    const PREFIX = 'app_cache:';

    /**
     * Get cached data or execute callback and cache result
     *
     * @param string $key
     * @param callable $callback
     * @param int|null $ttl
     * @return mixed
     */
    public static function remember(string $key, callable $callback, ?int $ttl = null)
    {
        $cacheKey = self::PREFIX . $key;
        $ttl = $ttl ?? self::DEFAULT_TTL;

        try {
            return Cache::remember($cacheKey, $ttl, function () use ($callback, $key) {
                Log::info("Cache miss for key: {$key}");
                return $callback();
            });
        } catch (\Exception $e) {
            Log::error("Cache error for key {$key}: " . $e->getMessage());
            // Fallback to direct execution if cache fails
            return $callback();
        }
    }

    /**
     * Invalidate cache by key
     *
     * @param string $key
     * @return bool
     */
    public static function forget(string $key): bool
    {
        $cacheKey = self::PREFIX . $key;

        try {
            Log::info("Cache invalidated for key: {$key}");
            return Cache::forget($cacheKey);
        } catch (\Exception $e) {
            Log::error("Cache forget error for key {$key}: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Invalidate multiple cache keys
     *
     * @param array $keys
     * @return void
     */
    public static function forgetMultiple(array $keys): void
    {
        foreach ($keys as $key) {
            self::forget($key);
        }
    }

    /**
     * Clear all cache with a specific prefix
     *
     * @param string $prefix
     * @return bool
     */
    public static function clearPrefix(string $prefix): bool
    {
        try {
            // For Redis driver
            if (config('cache.default') === 'redis') {
                $redis = Cache::getRedis();
                $pattern = self::PREFIX . $prefix . '*';
                $keys = $redis->keys($pattern);

                if (!empty($keys)) {
                    foreach ($keys as $key) {
                        $redis->del($key);
                    }
                    Log::info("Cache cleared for prefix: {$prefix}");
                }

                return true;
            }

            // Fallback for other cache drivers
            return Cache::flush();
        } catch (\Exception $e) {
            Log::error("Cache clear error for prefix {$prefix}: " . $e->getMessage());
            return false;
        }
    }
}
