# User Active Status Feature

This document describes the implementation of the user active status feature that allows administrators to activate/deactivate user accounts.

## Overview

The active status feature allows owners to control which users can log into the system. When a user is deactivated:
- They cannot log in to the application
- They receive a clear message explaining their account has been deactivated
- They are instructed to contact an administrator

## Components

### 1. Database Migration

**File**: `backend/database/migrations/2025_10_17_084332_add_active_column_to_users_table.php`

Added the `active` column to the `users` table:
- **Type**: Boolean (tinyint(1))
- **Default**: `true` (1)
- **Position**: After `role_id` column

```php
$table->boolean('active')->default(true)->after('role_id');
```

### 2. User Model

**File**: `backend/app/Models/User.php`

**Changes**:
- Added `'active'` to `$fillable` array
- Added `'active' => 'boolean'` to casts array for proper type handling

### 3. Authentication Controller

**File**: `backend/app/Http/Controllers/Api/AuthController.php`

**Login Check** (Line 38-42):
```php
// Check if user is active
if (!$user->active) {
    throw ValidationException::withMessages([
        'email' => ['Your account has been deactivated. Please contact an administrator.'],
    ]);
}
```

The active check happens after credential verification but before 2FA is sent, preventing inactive users from even receiving 2FA codes.

### 4. User Controller

**File**: `backend/app/Http/Controllers/Api/UserController.php`

**Changes**:

#### index() method
- Returns `active` status for each user

#### store() method
- Accepts optional `active` parameter (defaults to `true`)
- Creates users as active by default

#### updateStatus() method (NEW)
- Endpoint: `PATCH /api/users/{id}/status`
- Updates only the active status of a user
- Requires owner role
- Returns updated user data

```php
public function updateStatus(Request $request, $id)
{
    $user = User::findOrFail($id);

    $validated = $request->validate([
        'active' => 'required|boolean',
    ]);

    $user->update(['active' => $validated['active']]);
    // ...
}
```

### 5. API Routes

**File**: `backend/routes/api.php`

**New Route**:
```php
Route::patch('/users/{id}/status', [UserController::class, 'updateStatus'])
    ->middleware('role:owner');
```

### 6. Frontend - Users Page

**File**: `frontend/src/app/users/page.tsx`

**Changes**:

#### Interface Update
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;  // NEW
  roles: Role[];
}
```

#### New Function: handleToggleActive()
```typescript
const handleToggleActive = async (userId: number, currentStatus: boolean) => {
  // Makes PATCH request to /api/users/{id}/status
  // Updates local state after successful response
}
```

#### UI Changes
1. **New "Status" Column**: Shows badge indicating Active/Inactive
   - Green badge for active users
   - Red badge for inactive users

2. **New "Actions" Column**: Contains toggle button
   - "Deactivate" button for active users (red)
   - "Activate" button for inactive users (green)

## Usage

### Deactivating a User

1. Navigate to the Users page (must be logged in as owner)
2. Find the user you want to deactivate
3. Click the "Deactivate" button in the Actions column
4. The user's status badge changes to "Inactive" (red)
5. The button changes to "Activate" (green)

### Activating a User

1. Navigate to the Users page
2. Find an inactive user
3. Click the "Activate" button
4. The user's status badge changes to "Active" (green)
5. The button changes to "Deactivate" (red)

### What Happens When a Deactivated User Tries to Log In

1. User enters email and password
2. Credentials are validated
3. System checks if user is active
4. If inactive, user receives error message:
   > "Your account has been deactivated. Please contact an administrator."
5. No 2FA code is sent
6. User cannot proceed with login

## API Endpoints

### Get All Users (with active status)
```
GET /api/users
Authorization: Bearer {token}
Role: owner

Response:
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "active": true,
      "roles": [...]
    }
  ]
}
```

### Create User (with optional active status)
```
POST /api/users
Authorization: Bearer {token}
Role: owner

Body:
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role_ids": [1, 2],
  "active": true  // Optional, defaults to true
}
```

### Update User Active Status
```
PATCH /api/users/{id}/status
Authorization: Bearer {token}
Role: owner

Body:
{
  "active": false
}

Response:
{
  "message": "User status updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "active": false,
    "roles": [...]
  }
}
```

### Login (with active check)
```
POST /api/login

Body:
{
  "email": "user@example.com",
  "password": "password"
}

Error Response (if user is inactive):
{
  "message": "The email field is invalid.",
  "errors": {
    "email": [
      "Your account has been deactivated. Please contact an administrator."
    ]
  }
}
```

## Database Schema

```sql
-- users table structure
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id BIGINT UNSIGNED NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,  -- NEW COLUMN
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  email_verified_at TIMESTAMP NULL,
  password VARCHAR(255) NOT NULL,
  remember_token VARCHAR(100) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);
```

## Security Considerations

1. **Owner Only**: Only users with the "owner" role can change user active status
2. **Authentication Required**: All endpoints require valid authentication token
3. **Login Prevention**: Inactive users are blocked at the authentication level
4. **No 2FA Waste**: 2FA codes are not sent to inactive users
5. **Clear Messaging**: Users receive clear feedback about their account status

## Testing

### Manual Testing Steps

1. **Test Deactivation**:
   - Create a test user
   - Deactivate the user via the Users page
   - Try to log in with that user's credentials
   - Verify the error message appears

2. **Test Activation**:
   - Reactivate the user
   - Try logging in again
   - Verify login succeeds

3. **Test UI Updates**:
   - Verify status badge changes color
   - Verify action button text and color change
   - Verify user list updates without page refresh

4. **Test Default Behavior**:
   - Create a new user
   - Verify they are active by default
   - Verify they can log in immediately

### Database Testing

```bash
# Check active column exists
docker exec vibecode-full-stack-starter-kit_mysql mysql -uroot -p... -e "DESCRIBE users;"

# Check all users are active by default
docker exec vibecode-full-stack-starter-kit_mysql mysql -uroot -p... -e "SELECT id, name, email, active FROM users;"

# Manually deactivate a user for testing
docker exec vibecode-full-stack-starter-kit_mysql mysql -uroot -p... -e "UPDATE users SET active = 0 WHERE email = 'test@example.com';"
```

### API Testing with curl

```bash
# Get users list
curl http://localhost:8201/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# Deactivate user
curl -X PATCH http://localhost:8201/api/users/1/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"active": false}'

# Try to login as deactivated user
curl -X POST http://localhost:8201/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

## Rollback

If you need to rollback this feature:

```bash
# Rollback the migration
docker exec vibecode-full-stack-starter-kit_php_fpm php artisan migrate:rollback --step=1
```

This will remove the `active` column from the users table.

## Future Enhancements

1. **Audit Log**: Track who deactivated/activated users and when
2. **Bulk Actions**: Allow activating/deactivating multiple users at once
3. **Email Notifications**: Notify users when their account is deactivated
4. **Auto-deactivation**: Deactivate users after X days of inactivity
5. **Reactivation Request**: Allow deactivated users to request reactivation
6. **Soft Delete vs Deactivate**: Add distinction between temporary deactivation and permanent deletion

## Troubleshooting

### User Can Still Login After Deactivation
- Check that migration ran successfully
- Verify active column exists in database
- Check AuthController has the active check
- Clear any cached sessions

### Toggle Button Not Working
- Check browser console for errors
- Verify API token is valid
- Verify user has owner role
- Check network tab for API response

### Error Messages Not Showing
- Verify ValidationException is being caught on frontend
- Check that error messages are properly displayed in login form
- Verify API is returning correct error format
