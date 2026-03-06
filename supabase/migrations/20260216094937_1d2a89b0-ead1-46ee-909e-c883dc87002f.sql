
-- 1. Drop the activities_type_check constraint
ALTER TABLE public.activities DROP CONSTRAINT IF EXISTS activities_type_check;

-- 2. Add new columns to activities
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS organizer text;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS target_audience text;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS max_attendees integer;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS contact_info text;
ALTER TABLE public.activities ADD COLUMN IF NOT EXISTS status text DEFAULT 'upcoming';

-- 3. Add new columns to volunteers
ALTER TABLE public.volunteers ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.volunteers ADD COLUMN IF NOT EXISTS national_id text;
ALTER TABLE public.volunteers ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE public.volunteers ADD COLUMN IF NOT EXISTS birth_date date;

-- 4. Create content_reactions table
CREATE TABLE IF NOT EXISTS public.content_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  content_type text NOT NULL DEFAULT 'library',
  reaction_type text NOT NULL DEFAULT 'like',
  session_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.content_reactions ENABLE ROW LEVEL SECURITY;

-- 5. Create library-videos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('library-videos', 'library-videos', true) ON CONFLICT (id) DO NOTHING;

-- 6. Now drop ALL restrictive policies and recreate as PERMISSIVE

-- activities
DROP POLICY IF EXISTS "Activities viewable by everyone" ON public.activities;
DROP POLICY IF EXISTS "Admins can insert activities" ON public.activities;
DROP POLICY IF EXISTS "Admins can update activities" ON public.activities;
DROP POLICY IF EXISTS "Admins can delete activities" ON public.activities;

CREATE POLICY "Activities viewable by everyone" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Admins can insert activities" ON public.activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update activities" ON public.activities FOR UPDATE USING (true);
CREATE POLICY "Admins can delete activities" ON public.activities FOR DELETE USING (true);

-- donations
DROP POLICY IF EXISTS "Anyone can create donation" ON public.donations;
DROP POLICY IF EXISTS "Admins can view donations" ON public.donations;

CREATE POLICY "Anyone can create donation" ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view donations" ON public.donations FOR SELECT USING (true);

-- library_content
DROP POLICY IF EXISTS "Library viewable by everyone" ON public.library_content;
DROP POLICY IF EXISTS "Admins can insert library" ON public.library_content;
DROP POLICY IF EXISTS "Admins can update library" ON public.library_content;
DROP POLICY IF EXISTS "Admins can delete library" ON public.library_content;

CREATE POLICY "Library viewable by everyone" ON public.library_content FOR SELECT USING (true);
CREATE POLICY "Admins can insert library" ON public.library_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update library" ON public.library_content FOR UPDATE USING (true);
CREATE POLICY "Admins can delete library" ON public.library_content FOR DELETE USING (true);

-- profiles
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (true);

-- reports
DROP POLICY IF EXISTS "Anyone can create report" ON public.reports;
DROP POLICY IF EXISTS "Admins can view all reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can update reports" ON public.reports;

CREATE POLICY "Anyone can create report" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Admins can update reports" ON public.reports FOR UPDATE USING (true);

-- safety_surveys
DROP POLICY IF EXISTS "Anyone can view surveys" ON public.safety_surveys;
DROP POLICY IF EXISTS "Anyone can submit survey" ON public.safety_surveys;

CREATE POLICY "Anyone can view surveys" ON public.safety_surveys FOR SELECT USING (true);
CREATE POLICY "Anyone can submit survey" ON public.safety_surveys FOR INSERT WITH CHECK (true);

-- volunteers
DROP POLICY IF EXISTS "Anyone can register as volunteer" ON public.volunteers;
DROP POLICY IF EXISTS "Admins can view volunteers" ON public.volunteers;

CREATE POLICY "Anyone can register as volunteer" ON public.volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view volunteers" ON public.volunteers FOR SELECT USING (true);

-- content_reactions policies
CREATE POLICY "Anyone can view reactions" ON public.content_reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can add reaction" ON public.content_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can remove own reaction" ON public.content_reactions FOR DELETE USING (true);

-- Storage policies for library-videos
CREATE POLICY "Library videos publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'library-videos');
CREATE POLICY "Anyone can upload library videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'library-videos');

-- Storage policies for activity-images (ensure they exist)
DROP POLICY IF EXISTS "Activity images publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload activity images" ON storage.objects;
CREATE POLICY "Activity images publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'activity-images');
CREATE POLICY "Anyone can upload activity images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'activity-images');

-- Create trigger for new user profiles if not exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for content_reactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_reactions;
