# Role-Based Access Control (RBAC) Implementation

This document describes the role-based access control middleware implementation for securing routes on both backend and frontend.

## Overview

The application now includes comprehensive role-based access control that restricts access to routes based on user roles. This works seamlessly on both the backend API and frontend pages.

## Available Roles

The system currently supports the following roles:
- **owner** - Full system access and management capabilities
- **frontend** - Frontend development and related tasks
- **backend** - Backend development and API management
- **tester** - Testing and quality assurance roles

## Backend Implementation (Laravel)

### Middleware

The `CheckRole` middleware verifies that authenticated users have the required role(s) to access protected routes.

**Location**: `backend/app/Http/Middleware/CheckRole.php`

**Features**:
- Accepts multiple roles (OR logic - user needs at least one of the specified roles)
- Returns 403 Forbidden if user doesn't have required role
- Returns 401 Unauthorized if user is not authenticated
- Provides clear error messages with required vs. user roles

### Usage in Routes

The middleware is registered as `role` and can be used in route definitions:

```php
// Single role required
Route::get('/users', [UserController::class, 'index'])
    ->middleware('role:owner');

// Multiple roles (user needs at least one)
Route::get('/ai-tools', [AiToolController::class, 'index'])
    ->middleware('role:owner,frontend,backend');
```

### Current Route Protection

| Endpoint | Method | Required Role(s) | Description |
|----------|--------|-----------------|-------------|
| `/api/users` | GET | owner | List all users |
| `/api/users` | POST | owner | Create new user |
| `/api/roles` | GET | owner | List all roles |
| `/api/roles` | POST | owner | Create new role |
| `/api/ai-tools-types` | POST | owner | Create AI tool type |
| `/api/ai-tools` | GET | owner, frontend, backend | List AI tools |
| `/api/ai-tools` | POST | owner, backend | Create AI tool |
| `/api/ai-tools/{id}` | GET | owner, frontend, backend | View AI tool |
| `/api/ai-tools/{id}` | PUT | owner, backend | Update AI tool |
| `/api/ai-tools/{id}` | DELETE | owner | Delete AI tool |

### Error Responses

**403 Forbidden**:
```json
{
  "message": "Forbidden. You do not have the required role to access this resource.",
  "required_roles": ["owner"],
  "user_roles": ["frontend", "backend"]
}
```

**401 Unauthorized**:
```json
{
  "message": "Unauthenticated."
}
```

## Frontend Implementation (Next.js)

### Components and Hooks

#### 1. `useRoleAccess` Hook

Custom hook for checking role access with automatic redirection.

**Location**: `frontend/src/hooks/useRoleAccess.ts`

**Usage**:
```tsx
import { useRoleAccess } from '@/hooks/useRoleAccess';

function MyComponent() {
  const { hasAccess, loading, user } = useRoleAccess('owner');
  // Component will auto-redirect if user doesn't have access
}
```

**Features**:
- Checks authentication and role access
- Automatically redirects to login if not authenticated
- Automatically redirects to dashboard if role check fails
- Returns loading state during check
- Returns user object

#### 2. `checkUserRole` Function

Utility function for checking roles without redirect.

**Usage**:
```tsx
import { checkUserRole } from '@/hooks/useRoleAccess';

const canEdit = checkUserRole('owner');
const canView = checkUserRole(['owner', 'frontend', 'backend']);
```

#### 3. `RoleProtected` Component

Wrapper component for page-level protection with loading state.

**Location**: `frontend/src/components/RoleProtected.tsx`

**Usage**:
```tsx
import RoleProtected from '@/components/RoleProtected';

export default function MyPage() {
  return (
    <RoleProtected requiredRoles={['owner']}>
      {/* Page content - only visible to owners */}
      <div>Protected content</div>
    </RoleProtected>
  );
}
```

**Features**:
- Shows loading state while checking permissions
- Automatically redirects if access denied
- Optional fallback content
- Full page protection

#### 4. `RoleGuard` Component

Inline component for conditional rendering without redirect.

**Location**: `frontend/src/components/RoleGuard.tsx`

**Usage**:
```tsx
import RoleGuard from '@/components/RoleGuard';

export default function MyComponent() {
  return (
    <div>
      <RoleGuard requiredRoles={['owner', 'backend']}>
        <button>Delete</button>
      </RoleGuard>

      <RoleGuard
        requiredRoles={['owner']}
        fallback={<span>View Only</span>}
      >
        <button>Edit</button>
      </RoleGuard>
    </div>
  );
}
```

**Features**:
- Inline conditional rendering
- No automatic redirect (stays on page)
- Optional fallback content
- Perfect for hiding/showing specific UI elements

### Protected Pages

The following pages are currently protected:

| Page | Route | Required Role(s) |
|------|-------|-----------------|
| Users | `/users` | owner |
| Roles | `/roles` | owner |

### Example: Protecting a Page

```tsx
'use client';

import RoleProtected from '@/components/RoleProtected';
import AppLayout from '@/components/AppLayout';

export default function AdminPage() {
  return (
    <RoleProtected requiredRoles={['owner']}>
      <AppLayout>
        <div>
          <h1>Admin Dashboard</h1>
          {/* Only accessible by owners */}
        </div>
      </AppLayout>
    </RoleProtected>
  );
}
```

### Example: Conditional UI Elements

```tsx
import RoleGuard from '@/components/RoleGuard';
import { checkUserRole } from '@/hooks/useRoleAccess';

export default function ToolsList() {
  const canDelete = checkUserRole('owner');

  return (
    <div>
      <h1>AI Tools</h1>

      {/* Show edit button only to owners and backend users */}
      <RoleGuard requiredRoles={['owner', 'backend']}>
        <button>Edit</button>
      </RoleGuard>

      {/* Show delete button only to owners */}
      {canDelete && (
        <button>Delete</button>
      )}

      {/* Show different content based on role */}
      <RoleGuard
        requiredRoles={['owner']}
        fallback={<p>Contact admin to make changes</p>}
      >
        <button>Manage Settings</button>
      </RoleGuard>
    </div>
  );
}
```

## Testing Role-Based Access

### Backend Testing

Use curl or your API client to test role restrictions:

```bash
# Login as owner
curl -X POST http://localhost:8201/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aidemirski@abv.bg","password":"password"}'

# Try accessing owner-only endpoint (should work)
curl http://localhost:8201/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# Try accessing as non-owner (should return 403)
curl http://localhost:8201/api/users \
  -H "Authorization: Bearer NON_OWNER_TOKEN"
```

### Frontend Testing

1. **Test Owner Access**:
   - Login as `aidemirski@abv.bg` (owner role)
   - Navigate to `/users` - should work
   - Navigate to `/roles` - should work

2. **Test Non-Owner Access**:
   - Login as `john.doe@example.com` (frontend role only)
   - Try to navigate to `/users` - should redirect to dashboard
   - Check browser console for access denied message

3. **Test Multiple Roles**:
   - Login as user with multiple roles
   - Verify access to endpoints that accept any of their roles

## Adding Role Protection to New Routes

### Backend

1. Add middleware to route:
```php
Route::get('/my-endpoint', [MyController::class, 'index'])
    ->middleware('role:owner,admin');
```

2. For route groups:
```php
Route::middleware(['auth:sanctum', 'role:owner'])->group(function () {
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::get('/admin/settings', [AdminController::class, 'settings']);
});
```

### Frontend

1. For entire pages:
```tsx
export default function MyPage() {
  return (
    <RoleProtected requiredRoles={['owner', 'admin']}>
      <AppLayout>
        {/* Page content */}
      </AppLayout>
    </RoleProtected>
  );
}
```

2. For specific UI elements:
```tsx
<RoleGuard requiredRoles={['owner']}>
  <button>Admin Action</button>
</RoleGuard>
```

## Security Considerations

1. **Defense in Depth**: Both frontend and backend protection are in place
   - Frontend: Prevents UI access and improves UX
   - Backend: Enforces security at the API level (critical!)

2. **Never Trust Frontend**: Always enforce security on backend
   - Frontend checks are for UX only
   - Backend middleware is the actual security layer

3. **Token Security**: Ensure tokens are:
   - Stored securely (localStorage or httpOnly cookies)
   - Transmitted over HTTPS in production
   - Have appropriate expiration times

4. **Role Changes**: If user roles change:
   - Token must be refreshed with new role data
   - Or user must re-login

## Future Enhancements

- **Permission-based Access**: Granular permissions beyond roles
- **Resource-level Authorization**: Check ownership of specific resources
- **Audit Logging**: Track who accessed what and when
- **Dynamic Role Assignment**: Admin UI for managing user roles
- **Role Hierarchy**: Owner inherits all permissions from lower roles
- **API Rate Limiting**: Per-role rate limits

## Troubleshooting

### Backend: 403 Forbidden Errors

- Check user roles: `GET /api/me` to see current user's roles
- Verify route middleware configuration in `routes/api.php`
- Check CheckRole middleware logic in `app/Http/Middleware/CheckRole.php`

### Frontend: Unexpected Redirects

- Check browser console for error messages
- Verify localStorage has `user` object with `roles` array
- Check `useRoleAccess` hook is receiving correct role parameter
- Ensure user data includes roles array (not just single role)

### User Has Role But Still Can't Access

- Verify role name matches exactly (case-sensitive)
- Check if user object in localStorage is up to date
- Try logging out and back in to refresh token
- Check backend response includes roles in user object
