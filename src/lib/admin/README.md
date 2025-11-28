# 🔐 Admin Authentication & Authorization Library

Secure, session-based authentication for admin routes with automatic audit logging.

---

## 📚 Quick Start

### Basic Usage (Route Wrapper - Recommended)

```typescript
// src/app/api/admin/users/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin';
import { z } from 'zod';

const deleteUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().optional(),
});

export const DELETE = withAdminAuth(
  {
    action: 'USER_DELETE',
    requireBody: true,
    bodySchema: deleteUserSchema,
  },
  async (request, auth) => {
    const { userId, reason } = await request.json();
    
    // Execute deletion
    await deleteUser(userId);
    
    // Return success (auth already verified, action automatically logged)
    return NextResponse.json({
      success: true,
      deletedBy: auth.userEmail,
      deletedAt: new Date().toISOString(),
    });
  }
);
```

**Benefits:**
- ✅ Auto authentication check
- ✅ Auto authorization (role-based)
- ✅ Auto audit logging
- ✅ Auto error handling
- ✅ Request body validation (optional)
- ✅ 2FA support (for sensitive actions)

---

### Manual Usage (Advanced)

```typescript
import { authenticateAdmin, logAdminAction } from '@/lib/admin';

export async function GET(request: NextRequest) {
  // 1. Authenticate
  const auth = await authenticateAdmin(request);
  
  if (!auth.isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }
  
  // 2. Perform action
  const data = await getAdminData();
  
  // 3. Log action
  await logAdminAction(request, auth.userId!, {
    action: 'ADMIN_DATA_VIEW',
    success: true,
  });
  
  return NextResponse.json(data);
}
```

---

## 🔐 Authentication Flow

```
1. Request arrives
2. withAdminAuth wrapper called
3. ├─ Check session (Supabase auth cookies)
4. ├─ Query profiles table for role
5. ├─ Verify role = 'admin' or 'superadmin'
6. ├─ Check 2FA (if required for action)
7. ├─ Execute handler
8. └─ Log to admin_audit_logs table
```

---

## 🎯 Action Types

### Standard Actions (No 2FA)
- `USER_LIST` - View user list
- `USER_VIEW` - View user details
- `CREDIT_VIEW` - View credit history
- `ANALYTICS_VIEW` - View analytics

### Sensitive Actions (Require 2FA)
- `USER_DELETE` - Delete user
- `USER_BAN` - Ban user
- `CREDIT_MODIFY` - Modify user credits
- `ROLE_CHANGE` - Change user role
- `SYSTEM_CONFIG` - System configuration

### Superadmin Only
- `ADMIN_CREATE` - Create new admin
- `ADMIN_DELETE` - Delete admin
- `SYSTEM_CONFIG` - Critical system changes

---

## 📊 Audit Logging

Every admin action is automatically logged to `admin_audit_logs` table:

```sql
SELECT * FROM recent_admin_actions;
-- Returns: admin_email, action, target, success, created_at

SELECT * FROM failed_admin_actions;
-- Security monitoring: failed attempts

SELECT * FROM admin_activity_summary;
-- Admin activity stats
```

**Logged Information:**
- Admin ID & email
- Action performed
- Target type & ID
- IP address & user agent
- Request method & path
- Request body (sanitized)
- Response status
- Success/failure
- Error message (if any)
- Timestamp

---

## 🔒 Security Features

### 1. Session-Based Auth (Not Header-Based!)
- Uses Supabase auth session cookies
- No vulnerable API keys in headers
- Automatic session validation

### 2. Role-Based Access Control
- `user` - No admin access
- `admin` - Admin dashboard access
- `superadmin` - Full access

### 3. 2FA Support (Optional)
- Sensitive actions require 2FA
- TOTP-based (placeholder ready)
- Configurable per action

### 4. Automatic Audit Trail
- Every action logged
- Immutable records (no updates/deletes)
- IP & user agent tracking

### 5. Error Handling
- Graceful failures
- User-friendly errors
- Automatic logging on errors

---

## 🛠️ Configuration

### Enable 2FA for Your Action

```typescript
// src/lib/admin/auth.ts
const SENSITIVE_ACTIONS = [
  'USER_DELETE',
  'USER_BAN',
  'CREDIT_MODIFY',
  'YOUR_ACTION_HERE',  // Add your action
];
```

### Add Superadmin-Only Action

```typescript
const SUPERADMIN_ONLY_ACTIONS = [
  'ADMIN_CREATE',
  'ADMIN_DELETE',
  'YOUR_CRITICAL_ACTION',  // Add here
];
```

---

## 📖 API Reference

### `withAdminAuth(config, handler)`

**Config:**
- `action` (required): Action name (string)
- `requireBody` (optional): Require request body (boolean)
- `bodySchema` (optional): Zod schema for validation

**Handler:**
- Receives `(request, auth)` parameters
- `auth.userId` - Admin user ID
- `auth.userEmail` - Admin email
- `auth.role` - Admin role
- `auth.isSuperAdmin` - Is superadmin?

**Returns:** NextResponse

---

### `authenticateAdmin(request, require2FA?)`

**Parameters:**
- `request` - NextRequest
- `require2FA` - Boolean (default: false)

**Returns:**
```typescript
{
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  userId?: string;
  userEmail?: string;
  role?: 'user' | 'admin' | 'superadmin';
  error?: string;
}
```

---

### `logAdminAction(request, adminId, data)`

**Data:**
```typescript
{
  action: string;
  targetType?: string;
  targetId?: string;
  requestBody?: any;
  responseStatus?: number;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}
```

---

## ✅ Best Practices

1. **Always use `withAdminAuth` wrapper** for admin routes
2. **Use descriptive action names** (e.g., `USER_DELETE` not `delete`)
3. **Add 2FA for sensitive operations**
4. **Include target info in logs** (targetType, targetId)
5. **Review audit logs regularly** (weekly)
6. **Investigate failed actions** (security monitoring)

---

## 🚨 Security Notes

**⚠️ IMPORTANT:**
- Never bypass authentication checks
- Never disable audit logging
- Keep admin user count minimal
- Use superadmin sparingly
- Review logs for suspicious activity
- Enable 2FA for production admins

---

## 📚 Examples

### Example 1: Add Credits

```typescript
export const POST = withAdminAuth(
  { action: 'CREDIT_ADD', requireBody: true },
  async (request, auth) => {
    const { userId, amount } = await request.json();
    
    await addCredits(userId, amount);
    
    return NextResponse.json({
      success: true,
      amount,
      addedBy: auth.userEmail,
    });
  }
);
```

### Example 2: Ban User (2FA Required)

```typescript
export const POST = withAdminAuth(
  { action: 'USER_BAN', requireBody: true },  // Auto 2FA check
  async (request, auth) => {
    const { userId, reason } = await request.json();
    
    await banUser(userId, reason);
    
    return NextResponse.json({
      success: true,
      bannedBy: auth.userEmail,
      reason,
    });
  }
);
```

### Example 3: Superadmin Only

```typescript
export const DELETE = withAdminAuth(
  { action: 'ADMIN_DELETE' },  // Superadmin required
  async (request, auth) => {
    // Only superadmins can reach here
    const { adminId } = await request.json();
    
    await deleteAdmin(adminId);
    
    return NextResponse.json({ success: true });
  }
);
```

---

**Created:** Day 1, Week 1 Security Sprint  
**Version:** 1.0.0  
**Status:** Production Ready ✅

