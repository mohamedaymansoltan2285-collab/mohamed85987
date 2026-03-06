
-- Fix RLS policies: Change from RESTRICTIVE to PERMISSIVE for proper OR logic

-- Fix activities policies
DROP POLICY IF EXISTS "Activities are viewable by everyone" ON public.activities;
DROP POLICY IF EXISTS "Admins can manage activities" ON public.activities;

CREATE POLICY "Activities are viewable by everyone"
ON public.activities FOR SELECT
USING (true);

CREATE POLICY "Admins can insert activities"
ON public.activities FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'moderator')));

CREATE POLICY "Admins can update activities"
ON public.activities FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'moderator')));

CREATE POLICY "Admins can delete activities"
ON public.activities FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'moderator')));

-- Fix reports policies
DROP POLICY IF EXISTS "Admins can view all reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
DROP POLICY IF EXISTS "Anyone can create report" ON public.reports;
DROP POLICY IF EXISTS "Admins can update reports" ON public.reports;

CREATE POLICY "Admins can view all reports"
ON public.reports FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'moderator')));

CREATE POLICY "Users can view their own reports"
ON public.reports FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create report"
ON public.reports FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can update reports"
ON public.reports FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'moderator')));

-- Fix profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Fix safety_surveys policies
DROP POLICY IF EXISTS "Admins can view surveys" ON public.safety_surveys;
DROP POLICY IF EXISTS "Anyone can submit survey" ON public.safety_surveys;
DROP POLICY IF EXISTS "Public can view aggregated data" ON public.safety_surveys;

CREATE POLICY "Anyone can view surveys"
ON public.safety_surveys FOR SELECT
USING (true);

CREATE POLICY "Anyone can submit survey"
ON public.safety_surveys FOR INSERT
WITH CHECK (true);

-- Fix volunteers policies
DROP POLICY IF EXISTS "Admins can view volunteers" ON public.volunteers;
DROP POLICY IF EXISTS "Anyone can register as volunteer" ON public.volunteers;

CREATE POLICY "Admins can view volunteers"
ON public.volunteers FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'moderator')));

CREATE POLICY "Anyone can register as volunteer"
ON public.volunteers FOR INSERT
WITH CHECK (true);

-- Create library_content table
CREATE TABLE public.library_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'article', -- article, video, pdf
  category TEXT,
  url TEXT,
  thumbnail_url TEXT,
  duration TEXT,
  read_time TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.library_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Library content is viewable by everyone"
ON public.library_content FOR SELECT
USING (true);

CREATE POLICY "Admins can manage library content"
ON public.library_content FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'moderator')));

CREATE POLICY "Admins can update library content"
ON public.library_content FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'moderator')));

CREATE POLICY "Admins can delete library content"
ON public.library_content FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'moderator')));

-- Create donations table
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT,
  amount NUMERIC NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'vodafone_cash',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create donation"
ON public.donations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view donations"
ON public.donations FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin', 'moderator')));

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
