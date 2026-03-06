-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  college TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'volunteer', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create reports table (confidential reporting)
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional if user wants to report anonymously but tracked
  reporter_name TEXT, -- Optional
  college TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_info TEXT NOT NULL, -- Safe contact method
  attachments TEXT[], -- Array of file URLs
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'closed')),
  admin_notes TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policies for reports
CREATE POLICY "Admins can view all reports" 
ON public.reports FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')));

CREATE POLICY "Users can view their own reports" 
ON public.reports FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create report" 
ON public.reports FOR INSERT 
WITH CHECK (true); -- Allow anonymous inserts too (requires proper anon key setup or authenticated user)

CREATE POLICY "Admins can update reports" 
ON public.reports FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')));


-- Create activities/events table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  image_url TEXT,
  type TEXT CHECK (type IN ('seminar', 'workshop', 'campaign', 'video', 'news')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Policies for activities
CREATE POLICY "Activities are viewable by everyone" 
ON public.activities FOR SELECT USING (true);

CREATE POLICY "Admins can manage activities" 
ON public.activities FOR ALL 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')));


-- Create volunteers table
CREATE TABLE public.volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  college TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  skills TEXT,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for volunteers
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

-- Policies for volunteers
CREATE POLICY "Admins can view volunteers" 
ON public.volunteers FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')));

CREATE POLICY "Anyone can register as volunteer" 
ON public.volunteers FOR INSERT 
WITH CHECK (true);


-- Create survey/safety index table
CREATE TABLE public.safety_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feels_safe BOOLEAN,
  harassed BOOLEAN,
  knows_rights BOOLEAN,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  college TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for surveys
ALTER TABLE public.safety_surveys ENABLE ROW LEVEL SECURITY;

-- Policies for surveys
CREATE POLICY "Admins can view surveys" 
ON public.safety_surveys FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')));

CREATE POLICY "Public can view aggregated data" 
ON public.safety_surveys FOR SELECT 
USING (true); -- Usually we'd use a view for aggregation but keep it simple for now

CREATE POLICY "Anyone can submit survey" 
ON public.safety_surveys FOR INSERT 
WITH CHECK (true);


-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('activity-images', 'activity-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('report-attachments', 'report-attachments', false); -- Private bucket

-- Storage policies
CREATE POLICY "Public Access Activity Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'activity-images');

CREATE POLICY "Admins Upload Activity Images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'activity-images' AND EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')));

CREATE POLICY "Reporters Upload Attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'report-attachments'); -- Allow anyone to upload for reports (simplified)

CREATE POLICY "Admins View Report Attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'report-attachments' AND EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('admin', 'moderator')));
