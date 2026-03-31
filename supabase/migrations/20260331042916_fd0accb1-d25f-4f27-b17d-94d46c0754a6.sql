
-- Add is_banned column to profiles
ALTER TABLE public.profiles ADD COLUMN is_banned boolean NOT NULL DEFAULT false;

-- Allow admins to delete campaigns
CREATE POLICY "Admins can delete campaigns" ON public.campaigns
FOR DELETE TO authenticated
USING (is_admin(auth.uid()));

-- Allow admins to delete tasks
CREATE POLICY "Admins can delete tasks" ON public.tasks
FOR DELETE TO authenticated
USING (is_admin(auth.uid()));

-- Allow admins to update tasks
CREATE POLICY "Admins can update all tasks" ON public.tasks
FOR UPDATE TO authenticated
USING (is_admin(auth.uid()));

-- Allow admins to delete task submissions
CREATE POLICY "Admins can delete submissions" ON public.task_submissions
FOR DELETE TO authenticated
USING (is_admin(auth.uid()));

-- Delete all existing demo/test tasks
DELETE FROM public.task_submissions;
DELETE FROM public.tasks;
