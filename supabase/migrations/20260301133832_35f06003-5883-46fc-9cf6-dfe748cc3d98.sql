
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'moderator', 'editor', 'viewer', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user has any admin-level role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin', 'admin')
  )
$$;

-- Function to get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'moderator' THEN 3
    WHEN 'editor' THEN 4
    WHEN 'viewer' THEN 5
    WHEN 'user' THEN 6
  END
  LIMIT 1
$$;

-- RLS policies for user_roles
CREATE POLICY "Anyone can view roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Super admins can manage roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Super admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));

-- Enable realtime for user_roles
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;
