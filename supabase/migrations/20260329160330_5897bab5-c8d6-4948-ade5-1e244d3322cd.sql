
-- Create site_settings table for configurable values
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read/update settings
CREATE POLICY "Admins can view settings" ON public.site_settings FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));

-- Seed default referral bonus amount
INSERT INTO public.site_settings (key, value) VALUES ('referral_bonus_amount', '50') ON CONFLICT (key) DO NOTHING;

-- Also allow anon/public to read referral_bonus_amount via a security definer function
CREATE OR REPLACE FUNCTION public.get_referral_bonus_amount()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT value::integer FROM public.site_settings WHERE key = 'referral_bonus_amount'), 50)
$$;

-- Update award_referral_bonus to use dynamic bonus amount
CREATE OR REPLACE FUNCTION public.award_referral_bonus(_user_id uuid, _trigger text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _referrer_id uuid;
  _already_awarded boolean;
  _bonus integer;
BEGIN
  -- Get dynamic bonus amount
  _bonus := get_referral_bonus_amount();

  SELECT referred_by, referral_bonus_awarded 
  INTO _referrer_id, _already_awarded
  FROM public.profiles WHERE id = _user_id;

  IF _referrer_id IS NULL OR _already_awarded THEN
    RETURN;
  END IF;

  UPDATE public.profiles SET credits = credits + _bonus WHERE id = _referrer_id;

  INSERT INTO public.referral_bonuses (referrer_id, referred_id, bonus_amount, trigger_type)
  VALUES (_referrer_id, _user_id, _bonus, _trigger);

  INSERT INTO public.transactions (user_id, type, amount, description)
  VALUES (_referrer_id, 'earned', _bonus, 'Referral bonus: ' || _trigger);

  INSERT INTO public.notifications (user_id, type, title, message, icon)
  VALUES (_referrer_id, 'referral', 'Referral Bonus!', 'You earned ' || _bonus || ' credits from a referral!', '🎁');

  UPDATE public.profiles SET referral_bonus_awarded = true WHERE id = _user_id;
END;
$$;
