
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '🔔',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can update own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- System can insert notifications for any user (service role inserts via triggers)
CREATE POLICY "Authenticated users can receive notifications"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for notifications, tasks, campaigns
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns;

-- Trigger function: create notification when a task's completed_count changes
CREATE OR REPLACE FUNCTION public.notify_task_completed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.completed_count > OLD.completed_count THEN
    INSERT INTO public.notifications (user_id, type, title, message, icon)
    VALUES (
      NEW.user_id,
      'task',
      'Task Progress!',
      'Your task "' || NEW.title || '" reached ' || NEW.completed_count || ' completions',
      '✅'
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_task_completed
  AFTER UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_task_completed();

-- Trigger function: create notification when campaign status changes
CREATE OR REPLACE FUNCTION public.notify_campaign_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.notifications (user_id, type, title, message, icon)
    VALUES (
      NEW.user_id,
      'campaign',
      'Campaign Update',
      'Your campaign "' || NEW.title || '" is now ' || NEW.status,
      '🎯'
    );
  ELSIF NEW.completed_actions > OLD.completed_actions AND 
        NEW.completed_actions % 10 = 0 THEN
    INSERT INTO public.notifications (user_id, type, title, message, icon)
    VALUES (
      NEW.user_id,
      'campaign',
      'Campaign Milestone!',
      'Your campaign "' || NEW.title || '" reached ' || NEW.completed_actions || ' completions',
      '🎉'
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_campaign_updated
  AFTER UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_campaign_update();
