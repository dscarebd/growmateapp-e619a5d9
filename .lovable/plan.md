

## Plan: Admin-Controlled Withdraw Toggle

### How It Works
- Add a `withdrawal_enabled` key to the `site_settings` table (default: `"false"`)
- Admin panel gets a toggle switch in the Referrals/Settings tab to enable/disable withdrawals
- WalletPage checks this setting on load; if disabled, the withdraw tab shows a "Coming Soon" message instead of the form

### Changes

**1. Database: Insert new site setting**
- Insert `withdrawal_enabled = "false"` into `site_settings`

**2. `src/hooks/useAdmin.ts`**
- Add `withdrawalEnabled` state (boolean), parse from `site_settings` fetch
- Add `toggleWithdrawal` function to update the setting

**3. `src/pages/Admin.tsx`**
- Add a Switch toggle in the Referrals tab settings section: "Withdrawal System" on/off
- Uses `admin.withdrawalEnabled` and `admin.toggleWithdrawal`

**4. `src/pages/WalletPage.tsx`**
- On mount, fetch `withdrawal_enabled` from `site_settings` via an RPC or direct query
- Since `site_settings` RLS only allows admin reads, we need a small RPC function `get_withdrawal_enabled()` (similar to existing `get_usd_to_bdt_rate`)
- If disabled, render a "Coming Soon" card with a rocket icon when the withdraw tab is selected, hiding the form

**5. Database Migration**
- Create `get_withdrawal_enabled()` SQL function (SECURITY DEFINER, returns boolean)

### Files Modified
- New migration (insert setting + create RPC function)
- `src/hooks/useAdmin.ts` — add state + toggle
- `src/pages/Admin.tsx` — add Switch UI
- `src/pages/WalletPage.tsx` — conditional "Coming Soon" view

