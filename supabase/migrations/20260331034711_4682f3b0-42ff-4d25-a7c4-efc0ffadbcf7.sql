
-- Insert default USD to BDT rate
INSERT INTO public.site_settings (key, value) VALUES ('usd_to_bdt_rate', '120') ON CONFLICT (key) DO NOTHING;

-- Create security definer function for non-admin users to read the rate
CREATE OR REPLACE FUNCTION public.get_usd_to_bdt_rate()
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COALESCE((SELECT value::numeric FROM public.site_settings WHERE key = 'usd_to_bdt_rate'), 120)
$$;
