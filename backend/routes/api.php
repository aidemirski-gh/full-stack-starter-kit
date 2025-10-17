<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AiToolsTypeController;
use App\Http\Controllers\Api\AiToolController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-2fa', [AuthController::class, 'verify2FA']);
Route::post('/resend-2fa', [AuthController::class, 'resend2FA']);
Route::get('/ai-tools-types', [AiToolsTypeController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // AI Tools Types protected routes (owner only)
    Route::post('/ai-tools-types', [AiToolsTypeController::class, 'store'])
        ->middleware('role:owner');
    Route::post('/ai-tools-types/clear-cache', [AiToolsTypeController::class, 'clearCache'])
        ->middleware('role:owner');

    // Users routes (owner only)
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('role:owner');
    Route::post('/users', [UserController::class, 'store'])
        ->middleware('role:owner');
    Route::patch('/users/{id}/status', [UserController::class, 'updateStatus'])
        ->middleware('role:owner');

    // Roles routes (owner only)
    Route::get('/roles', [RoleController::class, 'index'])
        ->middleware('role:owner');
    Route::post('/roles', [RoleController::class, 'store'])
        ->middleware('role:owner');

    // AI Tools routes (accessible by owner, frontend, backend)
    Route::get('/ai-tools', [AiToolController::class, 'index'])
        ->middleware('role:owner,frontend,backend');
    Route::post('/ai-tools', [AiToolController::class, 'store'])
        ->middleware('role:owner,backend');
    Route::get('/ai-tools/{id}', [AiToolController::class, 'show'])
        ->middleware('role:owner,frontend,backend');
    Route::put('/ai-tools/{id}', [AiToolController::class, 'update'])
        ->middleware('role:owner,backend');
    Route::delete('/ai-tools/{id}', [AiToolController::class, 'destroy'])
        ->middleware('role:owner');
});
