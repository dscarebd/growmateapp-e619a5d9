

## Plan: Telegram Admin Notifications

### What will be built
An edge function that sends formatted Telegram messages to your chat whenever key events occur: new user signups, new campaigns, credit purchases, and withdrawal requests. Database triggers will call this function automatically.

### How it works

```text
DB Event (insert) → Database Trigger → Edge Function → Telegram Bot API → Your Chat
```

### Steps

1. **Connect Telegram connector** to the project (provides gateway credentials automatically)

2. **Store your chat ID** as a secret (`TELEGRAM_ADMIN_CHAT_ID` = `5190186520`)

3. **Create edge function `telegram-notify`**
   - Accepts event type + payload via POST
   - Formats a readable message based on event type:
     - **New User**: name, email, referral code, device info
     - **New Campaign**: title, platform, action, budget, reward, link
     - **Credit Purchase**: user email, amount, method, transaction ref
     - **Withdrawal Request**: user email, amount, method, net amount, commission
   - Sends via Telegram gateway (`sendMessage` with HTML parse mode)

4. **Create 4 database trigger functions** (SECURITY DEFINER, using `pg_net` to call the edge function):
   - `notify_telegram_new_user()` — on INSERT to `profiles`
   - `notify_telegram_new_campaign()` — on INSERT to `campaigns`
   - `notify_telegram_credit_purchase()` — on INSERT to `manual_payments`
   - `notify_telegram_withdrawal()` — on INSERT to `withdrawals`

5. **Create 4 database triggers** that fire AFTER INSERT on each respective table

### Message Format Examples

```text
🆕 New User Signed Up!
━━━━━━━━━━━━━━
Name: John Doe
Email: john@example.com
Referral Code: AB12CD34
Time: 2026-03-31 11:35 UTC

💰 New Credit Purchase!
━━━━━━━━━━━━━━
User: john@example.com
Amount: 500 credits
Method: bKash
Ref: TXN123456
Status: pending
```

### Files to create/modify
- `supabase/functions/telegram-notify/index.ts` — new edge function
- Database migration — trigger functions + triggers
- Secrets — `TELEGRAM_ADMIN_CHAT_ID`

