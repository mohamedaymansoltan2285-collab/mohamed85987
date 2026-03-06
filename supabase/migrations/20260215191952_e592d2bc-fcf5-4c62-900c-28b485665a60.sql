
-- Drop ALL existing RESTRICTIVE policies and recreate as PERMISSIVE

-- ============ REPORTS ============
DROP POLICY IF EXISTS "Admins can view all reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;
DROP POLICY IF EXISTS "Anyone can create report" ON public.reports;
DROP POLICY IF EXISTS "Admins can update reports" ON public.reports;

CREATE POLICY "Anyone can create report" ON public.reports FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view all reports" ON public.reports FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin','moderator')));
CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can update reports" ON public.reports FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin','moderator')));

-- ============ VOLUNTEERS ============
DROP POLICY IF EXISTS "Admins can view volunteers" ON public.volunteers;
DROP POLICY IF EXISTS "Anyone can register as volunteer" ON public.volunteers;

CREATE POLICY "Anyone can register as volunteer" ON public.volunteers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view volunteers" ON public.volunteers FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin','moderator')));

-- ============ ACTIVITIES ============
DROP POLICY IF EXISTS "Activities are viewable by everyone" ON public.activities;
DROP POLICY IF EXISTS "Admins can insert activities" ON public.activities;
DROP POLICY IF EXISTS "Admins can update activities" ON public.activities;
DROP POLICY IF EXISTS "Admins can delete activities" ON public.activities;

CREATE POLICY "Activities viewable by everyone" ON public.activities FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert activities" ON public.activities FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin','moderator')));
CREATE POLICY "Admins can update activities" ON public.activities FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin','moderator')));
CREATE POLICY "Admins can delete activities" ON public.activities FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin','moderator')));

-- ============ LIBRARY_CONTENT ============
DROP POLICY IF EXISTS "Library content is viewable by everyone" ON public.library_content;
DROP POLICY IF EXISTS "Admins can manage library content" ON public.library_content;
DROP POLICY IF EXISTS "Admins can update library content" ON public.library_content;
DROP POLICY IF EXISTS "Admins can delete library content" ON public.library_content;

CREATE POLICY "Library viewable by everyone" ON public.library_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert library" ON public.library_content FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin','moderator')));
CREATE POLICY "Admins can update library" ON public.library_content FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin','moderator')));
CREATE POLICY "Admins can delete library" ON public.library_content FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin','moderator')));

-- ============ DONATIONS ============
DROP POLICY IF EXISTS "Anyone can create donation" ON public.donations;
DROP POLICY IF EXISTS "Admins can view donations" ON public.donations;

CREATE POLICY "Anyone can create donation" ON public.donations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view donations" ON public.donations FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role IN ('admin','moderator')));

-- ============ SAFETY_SURVEYS ============
DROP POLICY IF EXISTS "Anyone can view surveys" ON public.safety_surveys;
DROP POLICY IF EXISTS "Anyone can submit survey" ON public.safety_surveys;

CREATE POLICY "Anyone can view surveys" ON public.safety_surveys FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can submit survey" ON public.safety_surveys FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ============ PROFILES ============
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ============ CREATE MISSING TRIGGER ============
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
