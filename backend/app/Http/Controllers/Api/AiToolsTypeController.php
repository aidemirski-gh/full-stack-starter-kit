<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiToolsType;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AiToolsTypeController extends Controller
{
    /**
     * Cache key for AI tools types with counts
     */
    const CACHE_KEY_TYPES_WITH_COUNTS = 'ai_tools_types:with_counts';

    /**
     * Get all AI tools types with tool counts (cached)
     */
    public function index()
    {
        $types = CacheService::remember(
            self::CACHE_KEY_TYPES_WITH_COUNTS,
            function () {
                Log::info('Fetching AI tools types from database with tool counts');

                // Fetch all types with tool counts
                $types = AiToolsType::withCount(['aiTools', 'aiToolsMany'])
                    ->get()
                    ->map(function ($type) {
                        // Combine both relationship counts
                        // aiTools: legacy one-to-many relationship
                        // aiToolsMany: new many-to-many relationship
                        $legacyCount = $type->ai_tools_count ?? 0;
                        $manyToManyCount = $type->ai_tools_many_count ?? 0;

                        // Use the higher count (or sum if both are used)
                        // Depending on your data model, adjust this logic
                        $totalCount = max($legacyCount, $manyToManyCount);

                        return [
                            'id' => $type->id,
                            'name' => $type->name,
                            'description' => $type->description,
                            'tools_count' => $totalCount,
                            'created_at' => $type->created_at,
                            'updated_at' => $type->updated_at,
                        ];
                    });

                return $types;
            },
            3600 // Cache for 1 hour
        );

        return response()->json([
            'data' => $types,
            'cached' => true
        ]);
    }

    /**
     * Store a new AI tools type
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $type = AiToolsType::create($validated);

        // Invalidate cache after creating a new type
        CacheService::forget(self::CACHE_KEY_TYPES_WITH_COUNTS);
        Log::info('Cache invalidated after creating AI tools type: ' . $type->id);

        // Add tools_count to response
        $type->tools_count = 0;

        return response()->json([
            'message' => 'AI tools type created successfully',
            'data' => $type
        ], 201);
    }

    /**
     * Clear cache manually (for admin purposes)
     */
    public function clearCache()
    {
        CacheService::forget(self::CACHE_KEY_TYPES_WITH_COUNTS);

        return response()->json([
            'message' => 'Cache cleared successfully'
        ]);
    }
}
