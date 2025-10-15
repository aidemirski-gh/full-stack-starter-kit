<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiToolsType;
use Illuminate\Http\Request;

class AiToolsTypeController extends Controller
{
    public function index()
    {
        $types = AiToolsType::all();

        return response()->json([
            'data' => $types
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $type = AiToolsType::create($validated);

        return response()->json([
            'message' => 'AI tools type created successfully',
            'data' => $type
        ], 201);
    }
}
