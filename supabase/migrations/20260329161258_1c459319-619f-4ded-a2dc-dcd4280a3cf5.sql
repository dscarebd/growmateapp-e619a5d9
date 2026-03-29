
-- Update default for new profiles
ALTER TABLE public.profiles 
  ALTER COLUMN referral_code SET DEFAULT upper(substr(md5((random())::text), 1, 8));

-- Update handle_new_user to generate 8-char code without prefix
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
  _ref_code := NEW.raw_user_meta_data->>'referral_code';
  IF _ref_code IS NOT NULL AND _ref_code != '' THEN
    SELECT id INTO _referrer_id FROM public.profiles WHERE referral_code = _ref_code;
  END IF;

  INSERT INTO public.profiles (id, name, email, referral_code, referred_by, device_fingerprint)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    upper(substr(md5(NEW.id::text), 1, 8)),
    _referrer_id,
    NEW.raw_user_meta_data->>'device_fingerprint'
  );
  RETURN NEW;
END;
$$;

-- Update existing profiles to remove BOOST- prefix
UPDATE public.profiles SET referral_code = upper(substr(md5(id::text), 1, 8)) WHERE referral_code LIKE 'BOOST-%';
