
-- Admin users table (specific email-based access)
CREATE TABLE public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin status (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN auth.users u ON u.email = au.email
    WHERE u.id = _user_id
  )
$$;

-- Admin users RLS (only admins can see the admin list)
CREATE POLICY "Admins can view admin list" ON public.admin_users
FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

-- Manual payments table
CREATE TABLE public.manual_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  method text NOT NULL DEFAULT 'bKash',
  transaction_ref text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  notes text DEFAULT '',
  approved_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.manual_payments ENABLE ROW LEVEL SECURITY;

-- Manual payments RLS
CREATE POLICY "Users can view own payments" ON public.manual_payments
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create payment requests" ON public.manual_payments
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update payments" ON public.manual_payments
FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));

-- Updated_at trigger for manual_payments
CREATE TRIGGER update_manual_payments_updated_at
BEFORE UPDATE ON public.manual_payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Admin RLS policies on existing tables

-- Profiles: admin can view all
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

-- Profiles: admin can update all
CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));

-- Campaigns: admin can view all
CREATE POLICY "Admins can view all campaigns" ON public.campaigns
FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

-- Campaigns: admin can update all
CREATE POLICY "Admins can update all campaigns" ON public.campaigns
FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));

-- Withdrawals: admin can view all
CREATE POLICY "Admins can view all withdrawals" ON public.withdrawals
FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

-- Withdrawals: admin can update all
CREATE POLICY "Admins can update all withdrawals" ON public.withdrawals
FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));

-- Transactions: admin can view all
CREATE POLICY "Admins can view all transactions" ON public.transactions
FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

-- Transactions: admin can create (for manual payment credits)
CREATE POLICY "Admins can create transactions" ON public.transactions
FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Notifications: admin can create for any user
CREATE POLICY "Admins can create notifications" ON public.notifications
FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.uid()));
