

## Plan: Admin-specific Bottom Navigation

When the user is on `/admin`, replace the standard bottom nav (Home, Campaign, Tasks, Wallet, Profile) with admin-relevant navigation buttons matching the admin panel tabs.

### Changes

**1. `src/components/BottomNav.tsx`**
- Detect if current route is `/admin`
- When on admin, render a different set of nav items with admin-relevant icons and labels:
  - **Overview** (TrendingUp icon) — sets tab to "overview"
  - **Users** (Users icon) — sets tab to "users"  
  - **Campaigns** (Megaphone icon) — center button, sets tab to "campaigns"
  - **Withdrawals** (Banknote icon) — sets tab to "withdrawals"
  - **Payments** (CreditCard icon) — sets tab to "payments"
- Instead of navigating to different routes, tapping these buttons will update a URL search param (e.g. `?tab=users`) or use a shared state/callback approach

**2. Approach for tab switching**
- Use URL search params (`?tab=overview`) so BottomNav can set the tab without tight coupling
- Update `Admin.tsx` to read the initial tab from `searchParams` and sync when it changes
- BottomNav admin buttons use `navigate("/admin?tab=users")` etc.

**3. Add a "Back to App" option**
- Include a small back/exit button in the admin header or as a long-press on the center button to return to `/home`

### Files to modify
- `src/components/BottomNav.tsx` — add admin nav items when on `/admin`
- `src/pages/Admin.tsx` — read tab from URL search params

