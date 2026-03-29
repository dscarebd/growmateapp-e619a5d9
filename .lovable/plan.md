

## Complete Referral System

### Overview
Build a full referral system with unique 8-digit referral codes, optional referral input at signup, referral bonus triggers, and device fingerprint restrictions to prevent abuse.

### Database Changes (3 migrations)

**1. Add referral tracking columns to `profiles` table:**
- `referred_by` (uuid, nullable) - references the referrer's profile id
- `device_fingerprint` (text, nullable) - stored at signup to prevent multi-account abuse
- `referral_bonus_awarded` (boolean, default false) - tracks if the referrer already received the bonus for this user

**2. Create `referral_bonuses` table:**
- `id` (uuid, PK)
- `referrer_id` (uuid, not null) - who gets the bonus
- `referred_id` (uuid, not null) - who triggered it
- `bonus_amount` (integer, default 50) - credits awarded
- `trigger_type` (text) - 'first_withdrawal' or 'campaign_500'
- `created_at` (timestamptz)
- RLS: users can view their own bonuses; admins can view all

**3. Create a database function `award_referral_bonus`:**
- Security definer function that checks if the referred user has a referrer, if the bonus hasn't been awarded yet, credits the referrer, inserts into `referral_bonuses`, creates a transaction record, sends a notification, and marks `referral_bonus_awarded = true`

**4. Add unique constraint on `device_fingerprint`** (where not null) to block duplicate signups from same device.

### Referral Code Format
The existing `referral_code` on profiles is already generated (e.g. `BOOST-A1B2C`). Change the generation to produce an **8-character alphanumeric code** (e.g. `BOOST-A1B2C3D4` or just `A1B2C3D4`). Update the `handle_new_user` trigger to use `upper(substr(md5(NEW.id::text), 1, 8))`.

### Frontend Changes

**1. Auth.tsx (Signup form):**
- Add optional "Referral Code" input field, shown only in signup mode
- Pass referral code to `signUp` function via user metadata
- Generate a device fingerprint (using canvas + screen + navigator info hash) and pass it to signup metadata
- Before signup, check if device fingerprint already exists in profiles table via an RPC call; block signup if it does

**2. AuthContext.tsx:**
- Update `signUp` to accept optional `referralCode` and `deviceFingerprint` parameters
- Pass both in `options.data` metadata

**3. Update `handle_new_user` database trigger:**
- Read `referral_code` from metadata, look up the referrer profile, and set `referred_by`
- Store `device_fingerprint` from metadata

**4. Device Fingerprint utility (`src/lib/deviceFingerprint.ts`):**
- Generate a hash from: `navigator.userAgent + screen.width + screen.height + screen.colorDepth + navigator.language + navigator.hardwareConcurrency + timezone`
- Use a simple string hash function (no crypto library needed)

**5. Bonus trigger points:**
- **WalletPage.tsx** (withdrawal): After successful withdrawal submission, call `supabase.rpc('award_referral_bonus', { _user_id, _trigger: 'first_withdrawal' })`
- **AppContext.tsx** (campaign creation): After creating a campaign with `totalBudget >= 500`, call `supabase.rpc('award_referral_bonus', { _user_id, _trigger: 'campaign_500' })`

**6. Profile.tsx:**
- Show referral stats (how many people referred, bonuses earned) in the referral card section

### Security
- Device fingerprint uniqueness enforced at DB level (unique constraint)
- Bonus awarding done via security definer function to prevent manipulation
- RLS on `referral_bonuses` table: users see only their own records

### Technical Details

```text
Signup Flow:
  User enters email, password, name, [optional referral code]
  -> Generate device fingerprint
  -> Check fingerprint uniqueness via RPC
  -> If duplicate: block with error "This device already has an account"
  -> If OK: signUp with metadata { name, referral_code, device_fingerprint }
  -> handle_new_user trigger creates profile with referred_by + fingerprint

Bonus Trigger Flow:
  User withdraws OR runs 500+ credit campaign
  -> Call award_referral_bonus RPC
  -> Function checks: has referrer? bonus not yet awarded?
  -> If eligible: credit referrer 50 credits, insert bonus record, notify
```

