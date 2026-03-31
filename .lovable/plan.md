

## Plan: Admin Campaign Removal, Credit Reduction & User Ban System

### What will be built

1. **Remove demo tasks from database** -- Delete any existing demo/test tasks from the tasks table.

2. **Admin can delete/remove running campaigns** -- Add a "Remove" button on campaigns in the admin Campaigns tab. This will delete the campaign and its associated tasks, refund remaining budget to the campaign owner, and notify them.

3. **Admin can reduce user credits** -- Add a "Reduce Credits" button alongside the existing "Add Credits" button in the Users tab, with a dialog to enter the amount and reason.

4. **Admin can ban/unban users** -- Add a `is_banned` column to the profiles table. Banned users will be blocked from logging in. Admin gets a "Ban/Unban" toggle in the User Details dialog.

---

### Technical Details

#### Database Migration
- Add `is_banned boolean NOT NULL DEFAULT false` to `profiles` table
- Create a `delete_campaign` function (SECURITY DEFINER) that:
  - Deletes associated tasks and task_submissions
  - Refunds unspent budget to the campaign owner
  - Deletes the campaign record
  - Creates a refund transaction and notification

#### Hook Changes (`src/hooks/useAdmin.ts`)
- Add `deleteCampaign(id)` -- calls the delete campaign function or does inline deletion + refund
- Add `reduceUserCredits(userId, amount, reason)` -- reduces credits, creates transaction, sends notification
- Add `toggleUserBan(userId, banned)` -- updates `is_banned` on profile, sends notification

#### Admin UI (`src/pages/Admin.tsx`)
- **Campaigns tab**: Add a red "Remove" button on all campaign cards (with confirmation)
- **Users tab**: Add "Reduce Credits" button next to "Add Credits"; add ban/unban status badge and toggle in User Details dialog
- Add a "Reduce Credits" dialog similar to the existing "Add Credits" dialog

#### Auth Guard (`src/contexts/AuthContext.tsx`)
- After session load, check `profiles.is_banned` -- if true, sign the user out and show an error toast

#### Demo Tasks Cleanup
- Run a migration or data delete to remove any leftover demo/test task rows (via SQL `DELETE` on tasks where appropriate, if any exist in DB)

