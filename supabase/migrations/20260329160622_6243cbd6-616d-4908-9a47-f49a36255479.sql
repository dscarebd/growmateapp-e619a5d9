
-- Add min campaign budget setting
INSERT INTO public.site_settings (key, value) VALUES ('min_campaign_budget_referral', '500') ON CONFLICT (key) DO NOTHING;

-- Function to get min campaign budget for referral
CREATE OR REPLACE FUNCTION public.get_min_campaign_budget_referral()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT value::integer FROM public.site_settings WHERE key = 'min_campaign_budget_referral'), 500)
$$;
