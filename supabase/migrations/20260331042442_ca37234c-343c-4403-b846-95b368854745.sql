
CREATE OR REPLACE FUNCTION public.get_welcome_bonus_amount()
 RETURNS integer
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT COALESCE((SELECT value::integer FROM public.site_settings WHERE key = 'welcome_bonus_amount'), 0)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _referrer_id uuid;
  _ref_code text;
  _welcome_bonus integer;
BEGIN
  _ref_code := NEW.raw_user_meta_data->>'referral_code';
  IF _ref_code IS NOT NULL AND _ref_code != '' THEN
    SELECT id INTO _referrer_id FROM public.profiles WHERE referral_code = _ref_code;
  END IF;

  -- Get welcome bonus amount from settings
  _welcome_bonus := get_welcome_bonus_amount();

  INSERT INTO public.profiles (id, name, email, referral_code, referred_by, device_fingerprint, credits)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    upper(substr(md5(NEW.id::text), 1, 8)),
    _referrer_id,
    NEW.raw_user_meta_data->>'device_fingerprint',
    _welcome_bonus
  );

  -- Create welcome bonus transaction if bonus > 0
  IF _welcome_bonus > 0 THEN
    INSERT INTO public.transactions (user_id, type, amount, description)
    VALUES (NEW.id, 'earned', _welcome_bonus, 'Welcome bonus');

    INSERT INTO public.notifications (user_id, type, title, message, icon)
    VALUES (NEW.id, 'system', 'Welcome Bonus!', 'You received ' || _welcome_bonus || ' credits as a welcome bonus!', '🎉');
  END IF;

  RETURN NEW;
END;
$function$;
