<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AiToolsTypeController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::get('/ai-tools-types', [AiToolsTypeController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // AI Tools Types protected routes
    Route::post('/ai-tools-types', [AiToolsTypeController::class, 'store']);

    // Users routes
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);

    // Roles routes
    Route::get('/roles', [RoleController::class, 'index']);
});
