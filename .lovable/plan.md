

## Plan: Add Payment Method Icons on Buy Credits Page

Add recognizable brand-colored icons/logos for each payment method (bKash, Nagad, Bank Transfer, Binance) displayed on the Buy Credits page, matching the project's existing pattern of custom SVG icons in `PlatformIcons.tsx`.

### Changes

**1. `src/components/PaymentIcons.tsx` (new file)**
- Create SVG icon components for: bKash (pink), Nagad (orange/red), Bank Transfer (generic bank icon via Lucide), Binance (yellow)
- Each icon follows the same pattern as `PlatformIcons.tsx` — accepts `className` prop, renders inline SVG with brand colors

**2. `src/pages/BuyCredits.tsx`**
- Create a `getPaymentIcon(name: string)` helper that maps method names (case-insensitive) to the corresponding icon component, with a fallback Lucide `Wallet` icon for unknown methods
- Update the payment method selector buttons (line ~259-272) to render the icon alongside the label
- Update the payment details section to also show the icon next to the method name

### Technical Details
- Icon mapping uses lowercase name matching: `"bkash"`, `"nagad"`, `"binance"`, `"bank"` (partial match)
- Unknown/new admin-added methods get a generic wallet icon
- Icons render at 20x20px inside the selector buttons

### Files
- **New**: `src/components/PaymentIcons.tsx`
- **Modified**: `src/pages/BuyCredits.tsx`

