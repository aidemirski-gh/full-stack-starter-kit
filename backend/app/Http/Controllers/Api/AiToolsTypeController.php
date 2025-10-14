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
}
