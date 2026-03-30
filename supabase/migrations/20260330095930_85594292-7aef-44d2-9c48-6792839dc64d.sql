-- Add icon_url column to payment_methods
ALTER TABLE public.payment_methods ADD COLUMN icon_url text DEFAULT NULL;

-- Create storage bucket for payment method icons
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-icons', 'payment-icons', true);

-- Allow admins to upload/manage icons
CREATE POLICY "Admins can manage payment icons" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'payment-icons' AND public.is_admin(auth.uid()))
  WITH CHECK (bucket_id = 'payment-icons' AND public.is_admin(auth.uid()));

-- Allow anyone to view payment icons
CREATE POLICY "Anyone can view payment icons" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'payment-icons');