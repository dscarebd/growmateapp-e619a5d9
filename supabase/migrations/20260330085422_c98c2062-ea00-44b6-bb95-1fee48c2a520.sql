CREATE POLICY "Users can view any profile basic info"
ON public.profiles FOR SELECT TO authenticated
USING (true);