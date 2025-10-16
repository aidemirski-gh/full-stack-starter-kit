# Two-Factor Authentication (2FA) Implementation

This document describes the 2FA security implementation for both web and mobile devices.

## Overview

The application now includes email-based Two-Factor Authentication (2FA) that works seamlessly on both web and mobile devices. When users log in, they receive a 6-digit verification code via email that must be entered to complete the login process.

## Features

### Backend (Laravel)

1. **Database Schema**
   - `verification_codes` table stores 6-digit codes
   - Tracks: user_id, code, type, expiration, usage status, IP address, and user agent
   - Codes expire after 10 minutes
   - Automatic cleanup of expired codes

2. **API Endpoints**
   - `POST /api/login` - Initiates login and sends 2FA code
   - `POST /api/verify-2fa` - Verifies the 6-digit code
   - `POST /api/resend-2fa` - Resends a new verification code

3. **Services**
   - `TwoFactorService` - Handles code generation, validation, and email sending
   - Generates cryptographically secure 6-digit codes
   - Automatically invalidates old codes when new ones are requested

4. **Security Features**
   - Codes expire after 10 minutes
   - One-time use codes (marked as used after verification)
   - IP address and user agent tracking
   - Rate limiting on resend requests (60-second cooldown)

### Frontend (Next.js)

1. **2FA Verification Page** (`/verify-2fa`)
   - Clean, user-friendly interface
   - 6-digit code input with auto-focus and auto-submit
   - Paste support for quick code entry
   - Real-time validation
   - Resend code functionality with countdown timer
   - Mobile-responsive design

2. **Login Flow**
   - Updated login page to handle 2FA redirect
   - Automatic redirection to verification page after credentials are validated
   - Session management with user data preservation

## Email Configuration

### Development/Testing
By default, emails are logged to `backend/storage/logs/laravel.log`. To view the verification codes during development:

```bash
docker exec vibecode-full-stack-starter-kit_php_fpm tail -f storage/logs/laravel.log
```

### Production Setup
To enable actual email sending in production, update the `.env` file in the backend:

#### Using SMTP (Gmail, SendGrid, etc.)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

#### Using Mailgun
```env
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=your-domain.mailgun.org
MAILGUN_SECRET=your-mailgun-api-key
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

#### Using AWS SES
```env
MAIL_MAILER=ses
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

## Testing the Implementation

### 1. Test Login Flow
1. Navigate to `http://localhost:8200/login`
2. Enter valid credentials (e.g., `aidemirski@abv.bg` / `password`)
3. You should be redirected to `/verify-2fa`
4. Check the Laravel logs for the 6-digit code:
   ```bash
   docker exec vibecode-full-stack-starter-kit_php_fpm tail -f storage/logs/laravel.log
   ```
5. Enter the code and verify successful login

### 2. Test Resend Functionality
1. On the 2FA verification page, click "Resend code"
2. A new code should be generated and logged
3. The resend button should show a 60-second countdown

### 3. Test Code Expiration
1. Wait 10 minutes after receiving a code
2. Try to use the expired code
3. Should receive an error: "The verification code is invalid or has expired"

### 4. Test Mobile Compatibility
1. Access the app from a mobile device using your IP address (e.g., `http://192.168.1.100:8200`)
2. Complete the login flow on mobile
3. Verify the 2FA page is responsive and touch-friendly

## Database Tables

### verification_codes
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| user_id | bigint | Foreign key to users table |
| code | string(6) | 6-digit verification code |
| type | string | Type of verification (login, password_reset, etc.) |
| expires_at | timestamp | Code expiration time |
| used | boolean | Whether code has been used |
| ip_address | string | IP address of the request |
| user_agent | text | User agent string |
| created_at | timestamp | When code was created |
| updated_at | timestamp | When code was last updated |

## API Response Examples

### Login Response (2FA Required)
```json
{
  "requires_2fa": true,
  "user_id": 5,
  "email": "aidemirski@abv.bg",
  "message": "Verification code sent to your email"
}
```

### Verify 2FA Success
```json
{
  "user": {
    "id": 5,
    "name": "Admin User",
    "email": "aidemirski@abv.bg",
    "role": "owner",
    "roles": ["owner", "frontend", "backend"]
  },
  "token": "16|abc123..."
}
```

### Verify 2FA Error
```json
{
  "message": "The verification code is invalid or has expired.",
  "errors": {
    "code": ["The verification code is invalid or has expired."]
  }
}
```

## Security Considerations

1. **Code Strength**: 6-digit codes provide 1,000,000 possible combinations
2. **Time Limit**: Codes expire after 10 minutes, limiting brute force attacks
3. **One-Time Use**: Codes are marked as used and cannot be reused
4. **Rate Limiting**: 60-second cooldown between resend requests
5. **Audit Trail**: IP address and user agent are logged for security monitoring
6. **HTTPS Required**: Always use HTTPS in production to prevent code interception

## Future Enhancements

- SMS-based 2FA as an alternative to email
- Authenticator app support (TOTP)
- Trusted device management
- Remember device for 30 days option
- Backup codes for emergency access
- Admin dashboard for 2FA statistics

## Troubleshooting

### Codes not being received
- Check Laravel logs: `docker exec vibecode-full-stack-starter-kit_php_fpm tail -f storage/logs/laravel.log`
- Verify email configuration in `.env`
- Check spam/junk folder (in production)

### Codes not working
- Verify code hasn't expired (10-minute limit)
- Ensure code hasn't already been used
- Check for typos (use paste functionality)

### Resend not working
- Wait for 60-second cooldown to expire
- Check network connection
- Verify user_id is being passed correctly

## Mobile Device Support

The implementation is fully compatible with mobile devices:
- Responsive design adapts to all screen sizes
- Touch-optimized input fields
- Numeric keyboard automatically shown on mobile
- Auto-advance between input fields
- Paste support for quick code entry from email apps
