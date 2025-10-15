<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiTool;
use Illuminate\Http\Request;

class AiToolController extends Controller
{
    public function index()
    {
        $aiTools = AiTool::with(['roles', 'aiToolsType'])->get();

        return response()->json([
            'data' => $aiTools
        ]);
    }
}
