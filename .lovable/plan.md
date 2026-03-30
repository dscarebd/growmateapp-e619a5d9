

## Advertiser Profile Page

### What We're Building
A dedicated advertiser profile page (`/advertiser/:id`) showing their details, reviews, and past tasks. The advertiser card on TaskDetail becomes clickable, linking to this new page.

### Changes

**1. Create `src/pages/AdvertiserProfile.tsx`**
- Fetch advertiser profile from `profiles` table (name, avatar, joined date, tasks completed, campaigns run)
- Fetch all reviews from `advertiser_reviews` table for this advertiser
- Fetch all tasks from `tasks` table created by this advertiser (past and active)
- Layout sections:
  - Header with avatar, name, join date, trust score
  - Stats row (tasks created, total reviews, average rating)
  - Reviews list (reuse/adapt AdvertiserReviews component)
  - Past tasks list showing title, platform, reward, completed count

**2. Update `src/pages/TaskDetail.tsx`**
- Wrap the advertiser card in a clickable link using `useNavigate` to `/advertiser/${task.user_id}`
- Add a chevron-right icon to hint it's tappable

**3. Update `src/App.tsx`**
- Add route: `/advertiser/:id` → `<AdvertiserProfile />`
- Wrap in `ProtectedRoute`

### RLS Note
No database changes needed. The `profiles` table has a self-select policy, but advertisers' profiles won't be visible to other users. We need to add an RLS policy allowing authenticated users to read any profile's public info (name, avatar_url, joined_date).

Actually, reviewing the existing policies — `profiles` only allows users to view their own profile. We'll need a new SELECT policy or a security-definer function to fetch public advertiser info. A migration will add:
```sql
CREATE POLICY "Users can view any profile basic info"
ON public.profiles FOR SELECT TO authenticated
USING (true);
```
This is acceptable since profiles only contain public-facing data (name, avatar, stats).

### Technical Details
- New file: `src/pages/AdvertiserProfile.tsx`
- Modified: `src/pages/TaskDetail.tsx` (clickable card), `src/App.tsx` (new route)
- Migration: Add public SELECT policy on profiles table

