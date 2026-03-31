
-- Insert withdrawal_enabled setting (default false)
INSERT INTO public.site_settings (key, value) VALUES ('withdrawal_enabled', 'false')
ON CONFLICT (key) DO NOTHING;

-- Create RPC function for public access
CREATE OR REPLACE FUNCTION public.get_withdrawal_enabled()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT value::boolean FROM public.site_settings WHERE key = 'withdrawal_enabled'), false)
$$;
