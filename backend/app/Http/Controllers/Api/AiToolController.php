<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiTool;
use Illuminate\Http\Request;

class AiToolController extends Controller
{
    public function index()
    {
        $aiTools = AiTool::with(['roles', 'aiToolsType', 'aiToolsTypes'])->get();

        return response()->json([
            'data' => $aiTools
        ]);
    }

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

        return response()->json([
            'message' => 'AI Tool created successfully',
            'data' => $aiTool
        ], 201);
    }
}
