

## Plan: Admin-Managed USD-to-BDT Exchange Rate

Add a configurable USD-to-BDT exchange rate that admins can set, displayed to users on the Buy Credits and Wallet pages so they can see BDT equivalents.

### Database Change

Insert a new `site_settings` row with key `usd_to_bdt_rate` and default value `120` (approximate current rate).

### Admin Panel (`src/pages/Admin.tsx`)

Add a "Currency Settings" section (in the referrals/settings tab or a new settings area) with:
- Current USD-to-BDT rate display
- Input + Update button to change the rate

### useAdmin Hook (`src/hooks/useAdmin.ts`)

- Add `usdToBdtRate` state (default 120), populated from `site_settings` in `fetchAll`
- Add `updateUsdToBdtRate` function

### Buy Credits Page (`src/pages/BuyCredits.tsx`)

- Fetch `usd_to_bdt_rate` from `site_settings` on mount
- Show BDT equivalent next to each credit pack price (e.g., "$10 ≈ ৳1,200")
- Show BDT equivalent in the payment step summary

### Wallet Page (`src/pages/WalletPage.tsx`)

- Fetch `usd_to_bdt_rate` from `site_settings` on mount
- Show BDT equivalent for withdrawal net amount (e.g., "Net: $4.25 ≈ ৳510")
- Show BDT in the withdrawal confirmation dialog

### Technical Details
- Uses existing `site_settings` table (no schema migration needed)
- BDT symbol: `৳`
- Rate fetched via public-facing query; RLS already allows admin read on `site_settings`, but we need to add a SELECT policy for authenticated users on the `usd_to_bdt_rate` key, OR use a security-definer function similar to `get_referral_bonus_amount()`

### Files
- **Data insert**: `site_settings` row for `usd_to_bdt_rate`
- **New migration**: Add a DB function `get_usd_to_bdt_rate()` (security definer) so non-admin users can read the rate
- **Modified**: `src/hooks/useAdmin.ts`, `src/pages/Admin.tsx`, `src/pages/BuyCredits.tsx`, `src/pages/WalletPage.tsx`

