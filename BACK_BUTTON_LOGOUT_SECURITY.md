# Back-Button Logout Security Implementation

This document explains the comprehensive security measures implemented to prevent the "back-button logout" vulnerability where logged-out users could access protected pages using the browser back button.

## The Problem

When users log out, they expect to be unable to access protected pages by clicking the back button. However, browsers cache pages in their history, and if pages aren't properly configured with cache control headers, users can access cached versions of protected pages without being authenticated.

## Solution Architecture

We've implemented a multi-layered approach combining:

1. **HTTP Cache Control Headers**
2. **Next.js Middleware**
3. **Client-side Session Management**
4. **Auth Context & Effects**
5. **Hard Redirects on Logout**

## Components

### 1. Cache Control Headers (`src/lib/cache-control.ts`)

Defines cache control headers for different page types:

```typescript
// Protected pages (authenticated)
cacheHeaders.noCache = 
  "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0"

// API responses
cacheHeaders.api = 
  "private, no-cache, no-store, must-revalidate"

// Public pages
cacheHeaders.public = 
  "public, max-age=3600, s-maxage=3600"
```

### 2. Next.js Middleware (`src/middleware.ts`)

Handles:
- ✅ Session validation on all protected routes
- ✅ Cache control headers per route type
- ✅ Automatic redirection to login for unauthenticated users
- ✅ Protection against cached responses

**Protected routes** (always cleared from cache):
- `/admin`
- `/staff`  
- `/user`
- `/dashboard`
- `/inventory`
- `/settings`

### 3. Root Layout Enhancements (`src/app/layout.tsx`)

- Wraps the app with `AuthProvider` and `CartProvider`
- Sets cache control headers
- Manages maximum request duration

### 4. Auth Context (`src/context/auth-context.tsx`)

Provides:
- Session state management
- Logout handler that clears:
  - sessionStorage
  - localStorage
  - cookies
  - browser history
- Re-initialization of auth state from sessionStorage on page load

**Logout Handler Features:**
```typescript
- Calls /api/auth/session POST to clear server-side session
- Clears all client-side storage (sessionStorage, localStorage)
- Replaces browser history state
- Prevents back navigation
- Performs hard redirect to /auth/signin
- Forces page reload for extra security
```

### 5. Logout Button Component (`src/components/auth/logout-button.tsx`)

Provides a reusable logout button that:
- Uses the Auth Context `logout()` method
- Shows loading state during logout
- Handles errors gracefully
- Force-redirects to signin page

### 6. Session/Logout API (`src/app/api/auth/session/route.ts`)

**POST endpoint:**
- Clears session cookies
- Sets cache-preventing headers
- Redirects to signin page

**GET endpoint:**
- Validates session
- Sets cache-preventing headers
- Returns 401 when session is invalid

## Security Measures

### Header-Based Security

```
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0
Pragma: no-cache
Expires: 0
Surrogate-Control: no-store
```

These headers tell:
- ✅ Browsers NOT to cache the page
- ✅ Proxies NOT to cache the page
- ✅ CDNs NOT to cache the page
- ✅ Requests to validate with server before using cache

### Middleware-Level Security

The middleware in `src/middleware.ts`:

1. **Checks authentication on protected routes**
   ```typescript
   if (isProtectedRoute && !sessionToken && !authToken) {
     return NextResponse.redirect(new URL("/login", request.url), { status: 307 });
   }
   ```

2. **Applies cache-busting headers to all responses**
   ```typescript
   response.headers.set("Cache-Control", "no-store, no-cache, ...");
   ```

3. **Prevents caching based on route type**
   ```typescript
   if (isProtectedRoute) {
     // No caching for protected pages
   } else if (pathname.startsWith("/api")) {
     // No caching for API responses
   } else {
     // Allow caching for public pages
   }
   ```

### Session Management Security

**During Login:**
1. User submits credentials
2. Role is detected based on email pattern
3. User role and email stored in sessionStorage
4. Hard redirect to dashboard: `window.location.href = redirectPath`
5. Page reloads from server (full page reload)

**During Logout:**
1. LogoutButton triggers `logout()` from Auth Context
2. POST to `/api/auth/session` to clear server-side session
3. Clear all client-side storage:
   - Remove sessionStorage keys
   - Clear localStorage
   - Delete cookies
4. Replace browser history: `window.history.replaceState()`
5. Hard redirect: `window.location.href = "/auth/signin"`
6. Force page reload: `window.location.reload()`

### Client-Side Protection

**In Auth Context:**
- Session state initialized from sessionStorage
- Logout clears all storage
- Hard redirects prevent router caching
- History replacement blocks back navigation

**In Updated Dashboard Pages:**
- `admin/page.tsx` - Uses LogoutButton
- `staff/page.tsx` - Uses LogoutButton
- `user/page.tsx` - Uses LogoutButton

## How It Prevents Back-Button Access

1. **Before calling logout:**
   ```
   User is on /admin page (cached)
   ```

2. **User clicks logout:**
   ```typescript
   logout() {
     // 1. Clear server-side session
     await fetch("/api/auth/session", { method: "POST" })
     
     // 2. Clear all storage
     sessionStorage.clear()
     localStorage.clear()
     
     // 3. Replace history
     window.history.replaceState({ logout: true }, "", "/")
     
     // 4. Hard redirect
     window.location.href = "/auth/signin"
     
     // 5. Force reload
     window.location.reload()
   }
   ```

3. **Browser navigation (back button):**
   ```
   Pressed back button → history.replaceState() prevents back navigation
   OR
   Page was already cleared from browser cache by headers
   OR
   Middleware checks session and redirects to /auth/signin
   ```

4. **Result:**
   ```
   ✅ User cannot see /admin cached page
   ✅ Middleware blocks unauthenticated access
   ✅ Cache headers prevent storing protected pages
   ✅ Session is cleared on all levels
   ```

## Testing the Implementation

### Test 1: Basic Logout
1. Log in to admin/staff/user dashboard
2. Click logout button
3. Attempt to go back with back button
4. **Result:** Should redirect to signin page

### Test 2: Browser Cache
1. Log in to admin page
2. Open DevTools → Network tab → disable cache
3. Log out
4. Try to access admin page directly in URL
5. **Result:** Should redirect to signin page

### Test 3: Page Refresh After Logout
1. Log in to a protected page
2. Click logout
3. Immediately refresh the page (Ctrl+R)
4. **Result:** Should be on signin page, not protected page

### Test 4: Multiple Tabs
1. Login in tab 1
2. Open protected page in tab 2
3. Logout from tab 1
4. Go to tab 2 and refresh
5. **Result:** Should be redirected to signin

## Files Modified

- `src/middleware.ts` - Added route protection and cache headers
- `src/lib/cache-control.ts` - Created cache control constants
- `src/app/layout.tsx` - Added AuthProvider and cache headers
- `src/context/auth-context.tsx` - Created with logout logic
- `src/components/auth/logout-button.tsx` - Created reusable logout button
- `src/app/admin/page.tsx` - Updated to use LogoutButton
- `src/app/staff/page.tsx` - Updated to use LogoutButton
- `src/app/user/page.tsx` - Updated to use LogoutButton
- `src/app/api/auth/session/route.ts` - Enhanced with cache headers (already existed)

## Production Considerations

### Session Tokens
Current implementation stores role in sessionStorage based on email pattern. For production:

1. **Use JWT tokens:**
   ```typescript
   // Instead of checking email pattern
   const token = request.headers.get("authorization");
   const payload = jwt.verify(token, secret);
   const role = payload.role; // Verified from server
   ```

2. **Store secure httpOnly cookies:**
   ```typescript
   response.cookies.set("auth-token", token, {
     httpOnly: true,
     secure: true,
     sameSite: "strict",
     maxAge: 3600,
   });
   ```

3. **Validate on every request:**
   ```typescript
   const token = request.cookies.get("auth-token");
   if (!isValidToken(token)) {
     redirect to login
   }
   ```

### Additional Security Measures

1. **CSRF Protection:**
   - Add CSRF tokens to logout form
   - Validate origin headers

2. **Session Timeout:**
   - Implement automatic logout after inactivity
   - Store session creation timestamp

3. **Rate Limiting:**
   - Limit login attempts
   - Track failed login attempts

4. **Audit Logging:**
   - Log all logout events
   - Track session start/end times
   - Monitor suspicious back-button access

5. **Content Security Policy:**
   ```typescript
   // In middleware or headers config
   "default-src 'self'",
   "script-src 'self' 'unsafe-inline'",
   "style-src 'self' 'unsafe-inline'",
   ```

## References

- [RFC 7234 - HTTP/1.1 Caching](https://tools.ietf.org/html/rfc7234)
- [MDN - Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Next.js Middleware](https://nextjs.org/docs/advanced-features/middleware)
- [Web Security - Sessions](https://owasp.org/www-community/attacks/Session_hijacking_attack)
- [Browser History API](https://developer.mozilla.org/en-US/docs/Web/API/History)
