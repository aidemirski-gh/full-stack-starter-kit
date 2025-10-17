<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\TwoFactorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $twoFactorService;

    public function __construct(TwoFactorService $twoFactorService)
    {
        $this->twoFactorService = $twoFactorService;
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user is active
        if (!$user->active) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated. Please contact an administrator.'],
            ]);
        }

        // Send 2FA code
        $this->twoFactorService->sendVerificationCode(
            $user,
            'login',
            $request->ip(),
            $request->userAgent()
        );

        // Return response indicating 2FA is required
        return response()->json([
            'requires_2fa' => true,
            'user_id' => $user->id,
            'email' => $user->email,
            'message' => 'Verification code sent to your email',
        ]);
    }

    public function verify2FA(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'code' => 'required|string|size:6',
        ]);

        $user = User::findOrFail($request->user_id);

        // Verify the code
        if (!$this->twoFactorService->verifyCode($user, $request->code, 'login')) {
            throw ValidationException::withMessages([
                'code' => ['The verification code is invalid or has expired.'],
            ]);
        }

        // Load the role relationships (both single and multiple)
        $user->load(['role', 'roles']);

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ? $user->role->name : null, // Legacy single role
                'roles' => $user->roles->pluck('name')->toArray(), // Multiple roles
            ],
            'token' => $token,
        ]);
    }

    public function resend2FA(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = User::findOrFail($request->user_id);

        // Send new verification code
        $this->twoFactorService->sendVerificationCode(
            $user,
            'login',
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'message' => 'New verification code sent to your email',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $user->load(['role', 'roles']);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ? $user->role->name : null, // Legacy single role
                'roles' => $user->roles->pluck('name')->toArray(), // Multiple roles
            ],
        ]);
    }
}
