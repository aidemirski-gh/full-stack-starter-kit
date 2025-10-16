<?php

namespace App\Services;

use App\Models\User;
use App\Models\VerificationCode;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class TwoFactorService
{
    /**
     * Generate a 6-digit verification code
     */
    public function generateCode(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Create and send verification code to user
     */
    public function sendVerificationCode(User $user, string $type = 'login', ?string $ipAddress = null, ?string $userAgent = null): VerificationCode
    {
        // Delete old unused codes for this user and type
        VerificationCode::where('user_id', $user->id)
            ->where('type', $type)
            ->where('used', false)
            ->delete();

        // Generate new code
        $code = $this->generateCode();

        // Create verification code record
        $verificationCode = VerificationCode::create([
            'user_id' => $user->id,
            'code' => $code,
            'type' => $type,
            'expires_at' => Carbon::now()->addMinutes(10), // Code valid for 10 minutes
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        // Send email
        $this->sendEmail($user, $code, $type);

        return $verificationCode;
    }

    /**
     * Verify the code
     */
    public function verifyCode(User $user, string $code, string $type = 'login'): bool
    {
        $verificationCode = VerificationCode::where('user_id', $user->id)
            ->where('code', $code)
            ->where('type', $type)
            ->where('used', false)
            ->first();

        if (!$verificationCode) {
            return false;
        }

        if (!$verificationCode->isValid()) {
            return false;
        }

        $verificationCode->markAsUsed();

        return true;
    }

    /**
     * Send verification email
     */
    private function sendEmail(User $user, string $code, string $type): void
    {
        $subject = $type === 'login' ? 'Login Verification Code' : 'Verification Code';

        Mail::raw(
            "Hello {$user->name},\n\n" .
            "Your verification code is: {$code}\n\n" .
            "This code will expire in 10 minutes.\n\n" .
            "If you didn't request this code, please ignore this email.\n\n" .
            "Best regards,\n" .
            "The Team",
            function ($message) use ($user, $subject) {
                $message->to($user->email)
                    ->subject($subject);
            }
        );
    }

    /**
     * Clean up expired codes
     */
    public function cleanupExpiredCodes(): int
    {
        return VerificationCode::where('expires_at', '<', Carbon::now())->delete();
    }
}
