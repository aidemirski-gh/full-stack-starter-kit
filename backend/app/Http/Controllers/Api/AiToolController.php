<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiTool;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AiToolController extends Controller
{
    /**
     * Get all AI tools with role-based filtering.
     *
     * Owners see all tools, other users see only tools assigned to their roles.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Get user's roles
        $userRoles = $user->roles()->pluck('roles.name')->toArray();

        // If user has 'owner' role, show all AI tools
        if (in_array('owner', $userRoles)) {
            $aiTools = AiTool::with(['roles', 'aiToolsType', 'aiToolsTypes'])->get();
        } else {
            // Otherwise, only show AI tools assigned to user's roles
            $userRoleIds = $user->roles()->pluck('roles.id')->toArray();

            if (empty($userRoleIds)) {
                // If user has no roles, return empty array
                return response()->json([
                    'data' => []
                ]);
            }

            $aiTools = AiTool::with(['roles', 'aiToolsType', 'aiToolsTypes'])
                ->whereHas('roles', function ($query) use ($userRoleIds) {
                    $query->whereIn('roles.id', $userRoleIds);
                })
                ->get();
        }

        return response()->json([
            'data' => $aiTools
        ]);
    }

    /**
     * Create a new AI tool.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'link' => 'required|url|max:255',
            'documentation' => 'nullable|url|max:255',
            'description' => 'required|string',
            'usage' => 'required|string',
            'ai_tools_type_ids' => 'required|array|min:1',
            'ai_tools_type_ids.*' => 'exists:ai_tools_types,id',
            'role_ids' => 'required|array|min:1',
            'role_ids.*' => 'exists:roles,id',
        ]);

        $aiTool = AiTool::create([
            'name' => $validated['name'],
            'link' => $validated['link'],
            'documentation' => $validated['documentation'] ?? null,
            'description' => $validated['description'],
            'usage' => $validated['usage'],
            'ai_tools_type_id' => $validated['ai_tools_type_ids'][0], // Keep legacy field for backward compatibility
        ]);

        // Attach AI tools types to the AI tool (many-to-many)
        $aiTool->aiToolsTypes()->attach($validated['ai_tools_type_ids']);

        // Attach roles to the AI tool
        $aiTool->roles()->attach($validated['role_ids']);

        // Load relationships for response
        $aiTool->load(['roles', 'aiToolsType', 'aiToolsTypes']);

        // Invalidate AI tools types cache (to update tool counts)
        CacheService::forget('ai_tools_types:with_counts');
        Log::info('Cache invalidated after creating AI tool: ' . $aiTool->id);

        return response()->json([
            'message' => 'AI Tool created successfully',
            'data' => $aiTool
        ], 201);
    }

    /**
     * Get a specific AI tool by ID.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $aiTool = AiTool::with(['roles', 'aiToolsType', 'aiToolsTypes'])->find($id);

        if (!$aiTool) {
            return response()->json([
                'message' => 'AI Tool not found'
            ], 404);
        }

        return response()->json([
            'data' => $aiTool
        ]);
    }

    /**
     * Update an existing AI tool.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $aiTool = AiTool::find($id);

        if (!$aiTool) {
            return response()->json([
                'message' => 'AI Tool not found'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'link' => 'required|url|max:255',
            'documentation' => 'nullable|url|max:255',
            'description' => 'required|string',
            'usage' => 'required|string',
            'ai_tools_type_ids' => 'required|array|min:1',
            'ai_tools_type_ids.*' => 'exists:ai_tools_types,id',
            'role_ids' => 'required|array|min:1',
            'role_ids.*' => 'exists:roles,id',
        ]);

        $aiTool->update([
            'name' => $validated['name'],
            'link' => $validated['link'],
            'documentation' => $validated['documentation'] ?? null,
            'description' => $validated['description'],
            'usage' => $validated['usage'],
            'ai_tools_type_id' => $validated['ai_tools_type_ids'][0], // Keep legacy field for backward compatibility
        ]);

        // Sync AI tools types (replace existing with new)
        $aiTool->aiToolsTypes()->sync($validated['ai_tools_type_ids']);

        // Sync roles (replace existing with new)
        $aiTool->roles()->sync($validated['role_ids']);

        // Load relationships for response
        $aiTool->load(['roles', 'aiToolsType', 'aiToolsTypes']);

        // Invalidate AI tools types cache (to update tool counts)
        CacheService::forget('ai_tools_types:with_counts');
        Log::info('Cache invalidated after updating AI tool: ' . $aiTool->id);

        return response()->json([
            'message' => 'AI Tool updated successfully',
            'data' => $aiTool
        ]);
    }

    /**
     * Delete an AI tool.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $aiTool = AiTool::find($id);

        if (!$aiTool) {
            return response()->json([
                'message' => 'AI Tool not found'
            ], 404);
        }

        // Delete the AI tool (relationships will be deleted automatically due to cascade)
        $aiTool->delete();

        // Invalidate AI tools types cache (to update tool counts)
        CacheService::forget('ai_tools_types:with_counts');
        Log::info('Cache invalidated after deleting AI tool: ' . $id);

        return response()->json([
            'message' => 'AI Tool deleted successfully'
        ]);
    }
}
