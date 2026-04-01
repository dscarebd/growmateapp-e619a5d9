
-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Trigger function: new user signup
CREATE OR REPLACE FUNCTION public.notify_telegram_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM extensions.http_post(
    url := 'https://jyrmykibysfnbprrenbz.supabase.co/functions/v1/telegram-notify',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cm15a2lieXNmbmJwcnJlbmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NTk3MDIsImV4cCI6MjA5MDMzNTcwMn0.Waukg4t1BLFm7ZsIqVdvYX3S19TGRdRhsF9fUtY1R-g'
    ),
    body := jsonb_build_object(
      'event_type', 'new_user',
      'record', jsonb_build_object(
        'name', NEW.name,
        'email', NEW.email,
        'referral_code', NEW.referral_code,
        'referred_by', NEW.referred_by,
        'created_at', NEW.created_at
      )
    )
  );
  RETURN NEW;
END;
$$;

-- Trigger function: new campaign
CREATE OR REPLACE FUNCTION public.notify_telegram_new_campaign()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM extensions.http_post(
    url := 'https://jyrmykibysfnbprrenbz.supabase.co/functions/v1/telegram-notify',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cm15a2lieXNmbmJwcnJlbmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NTk3MDIsImV4cCI6MjA5MDMzNTcwMn0.Waukg4t1BLFm7ZsIqVdvYX3S19TGRdRhsF9fUtY1R-g'
    ),
    body := jsonb_build_object(
      'event_type', 'new_campaign',
      'record', jsonb_build_object(
        'title', NEW.title,
        'platform', NEW.platform,
        'action', NEW.action,
        'total_budget', NEW.total_budget,
        'reward_per_action', NEW.reward_per_action,
        'link', NEW.link,
        'created_at', NEW.created_at
      )
    )
  );
  RETURN NEW;
END;
$$;

-- Trigger function: credit purchase
CREATE OR REPLACE FUNCTION public.notify_telegram_credit_purchase()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM extensions.http_post(
    url := 'https://jyrmykibysfnbprrenbz.supabase.co/functions/v1/telegram-notify',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cm15a2lieXNmbmJwcnJlbmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NTk3MDIsImV4cCI6MjA5MDMzNTcwMn0.Waukg4t1BLFm7ZsIqVdvYX3S19TGRdRhsF9fUtY1R-g'
    ),
    body := jsonb_build_object(
      'event_type', 'credit_purchase',
      'record', jsonb_build_object(
        'user_id', NEW.user_id,
        'amount', NEW.amount,
        'method', NEW.method,
        'transaction_ref', NEW.transaction_ref,
        'status', NEW.status,
        'created_at', NEW.created_at
      )
    )
  );
  RETURN NEW;
END;
$$;

-- Trigger function: withdrawal request
CREATE OR REPLACE FUNCTION public.notify_telegram_withdrawal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM extensions.http_post(
    url := 'https://jyrmykibysfnbprrenbz.supabase.co/functions/v1/telegram-notify',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cm15a2lieXNmbmJwcnJlbmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NTk3MDIsImV4cCI6MjA5MDMzNTcwMn0.Waukg4t1BLFm7ZsIqVdvYX3S19TGRdRhsF9fUtY1R-g'
    ),
    body := jsonb_build_object(
      'event_type', 'withdrawal',
      'record', jsonb_build_object(
        'user_id', NEW.user_id,
        'amount', NEW.amount,
        'method', NEW.method,
        'commission', NEW.commission,
        'net_amount', NEW.net_amount,
        'status', NEW.status,
        'requested_at', NEW.requested_at
      )
    )
  );
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER trigger_telegram_new_user
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_telegram_new_user();

CREATE TRIGGER trigger_telegram_new_campaign
  AFTER INSERT ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_telegram_new_campaign();

CREATE TRIGGER trigger_telegram_credit_purchase
  AFTER INSERT ON public.manual_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_telegram_credit_purchase();

CREATE TRIGGER trigger_telegram_withdrawal
  AFTER INSERT ON public.withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_telegram_withdrawal();
