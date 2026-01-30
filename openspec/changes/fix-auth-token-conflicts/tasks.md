## 1. Store Layer - Admin Token State

- [x] 1.1 Add `adminToken` and `isAdminAuthenticated` fields to `useUserStore` state interface
- [x] 1.2 Add `setAdminToken` and `clearAdminToken` actions to the store
- [x] 1.3 Modify hydration logic to detect admin routes (`/admin/*`) and read from `admin_access_token` instead of `access_token`
- [x] 1.4 Ensure hydration on admin routes sets `isAdminAuthenticated` not `isAuthenticated`

## 2. API Layer - Auth Endpoint Whitelist

- [x] 2.1 Define `AUTH_ENDPOINTS` constant array in `config.ts` containing `/api/v1/auth/login`, `/api/v1/auth/send-code`, `/api/v1/admin-auth/login`, `/api/v1/auth/register`
- [x] 2.2 Modify `fetchWebApi` 401 handling to check if URL matches any auth endpoint
- [x] 2.3 If URL is auth endpoint, return 401 response directly without calling `refreshAccessToken()` or `handleAuthExpired()`
- [x] 2.4 Add precondition check: only attempt refresh if `getAccessToken()` returns non-null value

## 3. API Layer - Route-Aware Token Selection

- [x] 3.1 Create helper function `isAdminRoute()` that checks if `window.location.pathname` starts with `/admin`
- [x] 3.2 Modify `getAccessToken()` to return `admin_access_token` when on admin routes, `access_token` otherwise
- [x] 3.3 Modify `getRefreshToken()` similarly to return `admin_refresh_token` on admin routes

## 4. Auth Functions - Admin Token Storage

- [x] 4.1 Modify `adminLogin()` in `auth.ts` to store tokens in `admin_access_token` and `admin_refresh_token`
- [x] 4.2 Modify `adminLogout()` to clear only admin-specific keys
- [x] 4.3 Ensure `userLogin()` continues to use `access_token` and `refresh_token`

## 5. Admin Layout - Auth Check

- [x] 5.1 Modify `apps/frontend/app/admin/layout.tsx` to check `isAdminAuthenticated` instead of `isAuthenticated`
- [x] 5.2 Ensure admin layout redirects to `/admin/login` when `isAdminAuthenticated` is false

## 6. Testing & Verification

- [ ] 6.1 Test: Login with wrong password shows error message, no redirect
- [ ] 6.2 Test: Admin login stores token in `admin_access_token`
- [ ] 6.3 Test: Admin route uses `admin_access_token` for API calls
- [ ] 6.4 Test: Ratel session exists but admin route still requires admin login
- [ ] 6.5 Test: Admin logout doesn't affect ratel session
