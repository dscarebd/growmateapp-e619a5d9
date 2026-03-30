
CREATE TABLE public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  instructions text NOT NULL DEFAULT 'Send payment to:',
  detail text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payment methods" ON public.payment_methods
  FOR ALL TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Users can view active payment methods" ON public.payment_methods
  FOR SELECT TO authenticated
  USING (is_active = true);

INSERT INTO public.payment_methods (name, instructions, detail, note, sort_order) VALUES
  ('bKash', 'Send payment to:', '01XXXXXXXXX', 'Use ''Send Money'' option. Personal number.', 0),
  ('Nagad', 'Send payment to:', '01XXXXXXXXX', 'Use ''Send Money'' from Nagad app.', 1),
  ('Bank Transfer', 'Transfer to:', 'AC: 1234567890 • Bank: Example Bank • Branch: Main', 'Include your username in the reference.', 2),
  ('Binance', 'Send USDT (TRC20) to:', 'TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Only send USDT via TRC20 network. Other tokens will be lost.', 3);
