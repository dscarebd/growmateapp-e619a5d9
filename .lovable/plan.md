

## Plan: Admin-Managed Payment Methods

Currently, payment methods (bKash, Nagad, Bank Transfer, Binance) are hardcoded in `BuyCredits.tsx`. This plan moves them to the database so admins can edit details and add new methods from the admin panel.

### Database Change

Create a `payment_methods` table:
- `id` (uuid, PK)
- `name` (text) — e.g. "bKash"
- `instructions` (text) — e.g. "Send payment to:"
- `detail` (text) — the account number/address
- `note` (text) — extra instructions
- `is_active` (boolean, default true)
- `sort_order` (integer, default 0)
- `created_at`, `updated_at`

RLS: Admins can CRUD, all authenticated users can SELECT active methods.

Seed with the 4 existing methods (bKash, Nagad, Bank Transfer, Binance).

### Admin Panel Changes (`src/pages/Admin.tsx`)

Add a "Payment Methods" management section in the Payments tab:
- List all payment methods with edit/toggle buttons
- Edit dialog: name, instructions, detail (account number), note, active toggle
- "Add New Method" button with the same form
- Delete or deactivate methods

### Buy Credits Page Changes (`src/pages/BuyCredits.tsx`)

- Fetch payment methods from `payment_methods` table (where `is_active = true`, ordered by `sort_order`)
- Replace the hardcoded `paymentMethods` array with the fetched data
- Fallback to hardcoded values if fetch fails

### useAdmin Hook (`src/hooks/useAdmin.ts`)

- Fetch `payment_methods` table data
- Add CRUD functions for payment methods

### Files to modify
- **New migration**: create `payment_methods` table + seed data
- `src/pages/Admin.tsx` — add payment methods management UI
- `src/pages/BuyCredits.tsx` — fetch methods from DB
- `src/hooks/useAdmin.ts` — add payment methods state and CRUD

