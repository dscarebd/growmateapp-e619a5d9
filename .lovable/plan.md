

## Plan: 3 Dedicated Detail Pages for Profile Stats

### Overview
Remove `<CompletedTasks />` from Profile, make the 3 stat cards clickable, and create 3 new pages they navigate to.

### Pages to Create

**1. `/tasks-completed` — Tasks Completed Page**
- Fetch all approved submissions for the current user from `task_submissions` (joined with `tasks` for title/platform/reward)
- Show list with platform icon, task title, reward earned, date completed
- Summary card at top showing total count

**2. `/my-campaigns` — My Campaigns Page**
- Fetch all campaigns for the current user from `campaigns` table
- Show each campaign with platform icon, title, status badge (active/paused/completed), budget, completed actions count
- Summary card at top showing total campaign count

**3. `/earnings` — Total Earnings Page**
- Fetch all transactions for the current user from `transactions` table
- Show transaction list with type badge (earned/spent/purchased/withdrawn), amount, description, date
- Summary card at top showing total earned amount

### Changes

**`src/pages/Profile.tsx`**
- Remove `CompletedTasks` import and `<CompletedTasks />` usage
- Make each stat card clickable: Tasks Done → `/tasks-completed`, Campaigns → `/my-campaigns`, Total Earned → `/earnings`
- Add chevron icon and hover effect on cards

**`src/pages/TasksCompleted.tsx`** (new)
- Back button header, list of approved submissions with task details

**`src/pages/MyCampaigns.tsx`** (new)
- Back button header, list of user's campaigns with status/budget info

**`src/pages/Earnings.tsx`** (new)
- Back button header, transaction history with type/amount/date

**`src/App.tsx`**
- Add 3 new protected routes: `/tasks-completed`, `/my-campaigns`, `/earnings`

### Files Modified
- `src/pages/Profile.tsx` — remove CompletedTasks, make cards clickable
- `src/pages/TasksCompleted.tsx` — new page
- `src/pages/MyCampaigns.tsx` — new page
- `src/pages/Earnings.tsx` — new page
- `src/App.tsx` — 3 new routes

