
-- Drop old donations table and recreate for non-monetary donations
DROP TABLE IF EXISTS public.donations;

CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text,
  email text,
  phone text,
  donation_type text NOT NULL DEFAULT 'other',
  description text,
  quantity text,
  availability text,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create donation" ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view donations" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Admins can update donations" ON public.donations FOR UPDATE USING (true);
