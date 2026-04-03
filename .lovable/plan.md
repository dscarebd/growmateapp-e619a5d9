

## Plan: Telegram Mini App Authentication

### Overview
Replace the current email/password auth with Telegram-based instant login. When the app runs inside Telegram (as a Mini App), it reads the user's Telegram data (`window.Telegram.WebApp.initDataUnsafe`), validates it server-side, and auto-creates/logs in the user -- no forms needed.

### Architecture

```text
Telegram Mini App
      │
      ▼
  Frontend detects Telegram WebApp SDK
      │
      ▼
  Sends initData to Edge Function (telegram-auth)
      │
      ▼
  Edge Function validates HMAC signature
  Upserts profile in DB
  Creates/signs in Supabase user (using admin API)
  Sends Telegram notification to admin
  Returns Supabase session tokens
      │
      ▼
  Frontend sets session, redirects to /home
```

### Changes

**1. Database Migration**
- Add `telegram_id bigint` and `telegram_username text` columns to `profiles` table
- Create unique index on `telegram_id`

**2. New Edge Function: `supabase/functions/telegram-auth/index.ts`**
- Receives Telegram `initData` string from frontend
- Validates HMAC using bot token (from `TELEGRAM_BOT_TOKEN` secret)
- Extracts user info (id, first_name, last_name, username, photo_url)
- Checks if profile with that `telegram_id` exists
  - If yes: signs in the existing Supabase user
  - If no: creates a new Supabase user (email: `tg_{id}@telegram.growmate.app`, random password), profile row auto-created by trigger, then updates `telegram_id`, `telegram_username`, `avatar_url` on profile
- Sends admin Telegram notification (new user event)
- Returns `{ access_token, refresh_token }` to frontend

**3. New secret needed: `TELEGRAM_BOT_TOKEN`**
- The raw bot token (from BotFather) is needed for HMAC validation of `initData`

**4. Update `src/contexts/AuthContext.tsx`**
- Add `signInWithTelegram(initData: string)` method
- Calls the `telegram-auth` edge function
- Sets session using `supabase.auth.setSession()`

**5. Update `src/pages/Auth.tsx`**
- Detect if running inside Telegram (`window.Telegram?.WebApp`)
- If yes: auto-call `signInWithTelegram` on mount, show loading spinner only
- If no: show the existing email/password form as fallback

**6. Update `index.html`**
- Add Telegram WebApp SDK script: `<script src="https://telegram.org/js/telegram-web-app.js"></script>`

**7. Update `src/pages/Profile.tsx`**
- Display Telegram username if available
- Hide email change option for Telegram users

**8. Update telegram-notify edge function**
- Add `telegram_login` event type for admin notification when a Telegram user logs in for the first time

### Secret Required
The bot token (`TELEGRAM_BOT_TOKEN`) will be requested via the secrets tool before proceeding with implementation.

