

## Plan: Make User Details Selectable/Copyable

The global CSS protection in `src/index.css` blocks all text selection. Inputs/textareas are already exempted. We need to add a `.selectable` utility class and apply it to user-facing data elements across the app.

### Changes

**1. `src/index.css`**
- Add a `.selectable` class that overrides user-select to `text`

**2. `src/pages/Profile.tsx`**
- Apply `.selectable` to: user name, email, referral code, trust score value

**3. `src/pages/SecurityPage.tsx`**
- Apply `.selectable` to: email display

**4. `src/pages/WalletPage.tsx`**
- Apply `.selectable` to: wallet address/account details, withdrawal amounts, transaction references

**5. `src/pages/BuyCredits.tsx`**
- Apply `.selectable` to: payment method details (account numbers, instructions), transaction references

**6. `src/pages/SettingsPage.tsx`** (if it has user details)
- Apply `.selectable` to any displayed user info

This ensures users can long-press/select their own details (name, email, referral codes, payment info, amounts) while keeping the rest of the UI protected.

### Technical Details
- Single CSS class: `.selectable { -webkit-user-select: text !important; user-select: text !important; -webkit-touch-callout: default !important; }`
- Applied via `className="selectable"` on relevant `<span>`, `<p>`, `<div>` elements
- No database or backend changes needed

### Files Modified
- `src/index.css`
- `src/pages/Profile.tsx`
- `src/pages/SecurityPage.tsx`
- `src/pages/WalletPage.tsx`
- `src/pages/BuyCredits.tsx`
- `src/pages/SettingsPage.tsx` (if applicable)

