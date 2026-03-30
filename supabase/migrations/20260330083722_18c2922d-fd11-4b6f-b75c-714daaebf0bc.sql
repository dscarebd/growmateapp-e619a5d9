
-- Create submission status type
CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Add proof_requirements to tasks
ALTER TABLE public.tasks ADD COLUMN proof_requirements text DEFAULT '';

-- Create task_submissions table
CREATE TABLE public.task_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  advertiser_id uuid NOT NULL,
  status public.submission_status NOT NULL DEFAULT 'pending',
  proof_text text DEFAULT '',
  proof_images text[] DEFAULT '{}',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  rejection_reason text DEFAULT ''
);

ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;

-- Users can insert own submissions
CREATE POLICY "Users can insert own submissions" ON public.task_submissions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can view own submissions
CREATE POLICY "Users can view own submissions" ON public.task_submissions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Advertisers can view submissions for their tasks
CREATE POLICY "Advertisers can view task submissions" ON public.task_submissions
  FOR SELECT TO authenticated USING (auth.uid() = advertiser_id);

-- Advertisers can update submissions for their tasks
CREATE POLICY "Advertisers can update task submissions" ON public.task_submissions
  FOR UPDATE TO authenticated USING (auth.uid() = advertiser_id);

-- Admins can do everything
CREATE POLICY "Admins can view all submissions" ON public.task_submissions
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all submissions" ON public.task_submissions
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

-- Create advertiser_reviews table
CREATE TABLE public.advertiser_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  submission_id uuid NOT NULL REFERENCES public.task_submissions(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL,
  advertiser_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.advertiser_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view reviews
CREATE POLICY "Anyone can view reviews" ON public.advertiser_reviews
  FOR SELECT TO authenticated USING (true);

-- Users can insert reviews
CREATE POLICY "Users can insert reviews" ON public.advertiser_reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id);

-- Create task-proofs storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('task-proofs', 'task-proofs', true);

-- Storage policies for task-proofs
CREATE POLICY "Users can upload proofs" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'task-proofs');

CREATE POLICY "Anyone can view proofs" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'task-proofs');

-- Function to approve submission and award credits
CREATE OR REPLACE FUNCTION public.approve_submission(_submission_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sub record;
  _task record;
  _profile record;
BEGIN
  SELECT * INTO _sub FROM public.task_submissions WHERE id = _submission_id AND status = 'pending';
  IF NOT FOUND THEN RETURN; END IF;

  SELECT * INTO _task FROM public.tasks WHERE id = _sub.task_id;
  SELECT * INTO _profile FROM public.profiles WHERE id = _sub.user_id;

  -- Update submission
  UPDATE public.task_submissions SET status = 'approved', reviewed_at = now() WHERE id = _submission_id;

  -- Update task completed count
  UPDATE public.tasks SET completed_count = completed_count + 1 WHERE id = _sub.task_id;

  -- Award credits
  UPDATE public.profiles SET 
    credits = credits + _task.reward,
    tasks_completed = tasks_completed + 1,
    total_earned = total_earned + _task.reward
  WHERE id = _sub.user_id;

  -- Create transaction
  INSERT INTO public.transactions (user_id, type, amount, description, platform)
  VALUES (_sub.user_id, 'earned', _task.reward, _task.action || ' - ' || _task.title, _task.platform);

  -- Notify user
  INSERT INTO public.notifications (user_id, type, title, message, icon)
  VALUES (_sub.user_id, 'task', 'Task Approved!', 'Your submission for "' || _task.title || '" was approved. +' || _task.reward || ' credits!', '✅');
END;
$$;
