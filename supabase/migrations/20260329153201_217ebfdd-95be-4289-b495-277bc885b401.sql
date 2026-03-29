
-- 1. Add referral columns to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS referred_by uuid,
  ADD COLUMN IF NOT EXISTS device_fingerprint text,
  ADD COLUMN IF NOT EXISTS referral_bonus_awarded boolean NOT NULL DEFAULT false;

-- Unique constraint on device_fingerprint (where not null)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_device_fingerprint 
  ON public.profiles (device_fingerprint) WHERE device_fingerprint IS NOT NULL;

-- 2. Update referral_code default to 8 chars
ALTER TABLE public.profiles 
  ALTER COLUMN referral_code SET DEFAULT ('BOOST-' || upper(substr(md5((random())::text), 1, 8)));

-- 3. Create referral_bonuses table
CREATE TABLE IF NOT EXISTS public.referral_bonuses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id uuid NOT NULL,
  referred_id uuid NOT NULL,
  bonus_amount integer NOT NULL DEFAULT 50,
  trigger_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_bonuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referral bonuses"
  ON public.referral_bonuses FOR SELECT TO authenticated
  USING (auth.uid() = referrer_id);

CREATE POLICY "Admins can view all referral bonuses"
  ON public.referral_bonuses FOR SELECT TO authenticated
  USING (is_admin(auth.uid()));

-- 4. Create check_device_fingerprint RPC
CREATE OR REPLACE FUNCTION public.check_device_fingerprint(_fingerprint text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE device_fingerprint = _fingerprint
  )
$$;

-- 5. Create award_referral_bonus RPC
CREATE OR REPLACE FUNCTION public.award_referral_bonus(_user_id uuid, _trigger text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _referrer_id uuid;
  _already_awarded boolean;
  _bonus integer := 50;
BEGIN
  -- Get referrer and check if bonus already awarded
  SELECT referred_by, referral_bonus_awarded 
  INTO _referrer_id, _already_awarded
  FROM public.profiles WHERE id = _user_id;

  -- Exit if no referrer or already awarded
  IF _referrer_id IS NULL OR _already_awarded THEN
    RETURN;
  END IF;

  -- Credit the referrer
  UPDATE public.profiles SET credits = credits + _bonus WHERE id = _referrer_id;

  -- Insert bonus record
  INSERT INTO public.referral_bonuses (referrer_id, referred_id, bonus_amount, trigger_type)
  VALUES (_referrer_id, _user_id, _bonus, _trigger);

  -- Create transaction for referrer
  INSERT INTO public.transactions (user_id, type, amount, description)
  VALUES (_referrer_id, 'earned', _bonus, 'Referral bonus: ' || _trigger);

  -- Notify referrer
  INSERT INTO public.notifications (user_id, type, title, message, icon)
  VALUES (_referrer_id, 'referral', 'Referral Bonus!', 'You earned ' || _bonus || ' credits from a referral!', '🎁');

  -- Mark as awarded
  UPDATE public.profiles SET referral_bonus_awarded = true WHERE id = _user_id;
END;
$$;

-- 6. Update handle_new_user trigger to handle referral + fingerprint + 8-char code
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _referrer_id uuid;
  _ref_code text;
BEGIN
  -- Look up referrer by referral code from metadata
  _ref_code := NEW.raw_user_meta_data->>'referral_code';
  IF _ref_code IS NOT NULL AND _ref_code != '' THEN
    SELECT id INTO _referrer_id FROM public.profiles WHERE referral_code = _ref_code;
  END IF;

  INSERT INTO public.profiles (id, name, email, referral_code, referred_by, device_fingerprint)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'BOOST-' || upper(substr(md5(NEW.id::text), 1, 8)),
    _referrer_id,
    NEW.raw_user_meta_data->>'device_fingerprint'
  );
  RETURN NEW;
END;
$$;
