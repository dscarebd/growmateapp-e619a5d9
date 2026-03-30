

## Plan: Task Submission & Advertiser Verification System

This is a major feature that replaces the current "5-second countdown" task flow with a proper proof-based verification system where advertisers review submissions.

### Current Flow (to be replaced)
Click "Start Task" → 5s countdown → Click "Claim Credits" → Done

### New Flow
1. Click "Start Task" → Opens **Task Detail Page** showing advertiser requirements
2. User completes the task externally, then **submits proof** (screenshot upload + text notes)
3. Submission goes to **advertiser's review queue** (pending status)
4. Advertiser **approves or rejects** the submission
5. If approved → credits auto-added to user balance
6. If rejected → no credits, user notified
7. After completion, user can **rate & review the advertiser** (1-5 stars + text)

### Database Changes (3 new tables + columns)

**1. `task_submissions` table** — tracks user proof submissions
- `id`, `task_id`, `user_id`, `advertiser_id`, `status` (pending/approved/rejected), `proof_text`, `proof_images` (text array of storage URLs), `submitted_at`, `reviewed_at`, `rejection_reason`

**2. `advertiser_reviews` table** — user reviews of advertisers after task completion
- `id`, `task_id`, `submission_id`, `reviewer_id`, `advertiser_id`, `rating` (1-5), `review_text`, `created_at`

**3. Add `proof_requirements` column to `tasks` table**
- JSON text field where advertiser specifies what proof is needed (e.g., "screenshot of subscription", "comment text")

**4. Storage bucket**: `task-proofs` for screenshot uploads

**5. RLS policies** for all new tables:
- Users can insert their own submissions and view their own
- Advertisers (task owners) can view and update submissions for their tasks
- Users can insert reviews for completed tasks and view all reviews

### Frontend Changes

**1. New page: `TaskDetail.tsx`** (route: `/task/:id`)
- Shows task info: platform, action, reward, advertiser name, link to content
- Shows advertiser's proof requirements
- Shows advertiser rating/reviews from other users
- "Submit Proof" section: file upload (screenshots) + text input
- Submit button sends proof to `task_submissions` table

**2. New page: `MySubmissions.tsx`** or section in existing page
- Shows user's submitted tasks with status (pending/approved/rejected)

**3. Update `Tasks.tsx`**
- "Start Task" navigates to `/task/:id` instead of starting a countdown
- Show submission status if user already submitted for a task

**4. Advertiser review section on campaign page or separate view**
- Advertisers see pending submissions for their campaigns/tasks
- Approve/reject buttons with optional rejection reason
- On approval: trigger credit addition + notification to user

**5. Review component after task approval**
- Star rating (1-5) + optional text review
- Displayed on task detail page for future users

**6. Update `AppContext.tsx`**
- Remove the old `completeTask` countdown logic
- Add `submitTaskProof` and `reviewSubmission` methods

### Files to Create/Modify

| File | Action |
|------|--------|
| DB migration | Create `task_submissions`, `advertiser_reviews` tables; add `proof_requirements` to `tasks`; create storage bucket |
| `src/pages/TaskDetail.tsx` | New — task details + proof submission + reviews display |
| `src/pages/Tasks.tsx` | Modify — navigate to detail page instead of countdown |
| `src/pages/CreateCampaign.tsx` | Modify — add proof requirements step |
| `src/components/AdvertiserReviews.tsx` | New — star rating display + review list |
| `src/components/SubmissionReview.tsx` | New — advertiser's approval/rejection UI |
| `src/contexts/AppContext.tsx` | Modify — replace completeTask, add submission logic |
| `src/App.tsx` | Modify — add new routes |
| `src/pages/Home.tsx` | Modify — update top tasks to navigate to detail page |

