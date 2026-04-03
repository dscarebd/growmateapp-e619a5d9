ALTER TABLE public.profiles ADD COLUMN telegram_id bigint;
ALTER TABLE public.profiles ADD COLUMN telegram_username text;

CREATE UNIQUE INDEX idx_profiles_telegram_id ON public.profiles (telegram_id) WHERE telegram_id IS NOT NULL;