
-- Add new columns to volunteers for showcase
ALTER TABLE public.volunteers ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE public.volunteers ADD COLUMN IF NOT EXISTS role_title text;
ALTER TABLE public.volunteers ADD COLUMN IF NOT EXISTS volunteer_section text;
ALTER TABLE public.volunteers ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false;

-- Create storage bucket for volunteer photos
INSERT INTO storage.buckets (id, name, public) VALUES ('volunteer-photos', 'volunteer-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for volunteer photos
CREATE POLICY "Volunteer photos are public" ON storage.objects FOR SELECT USING (bucket_id = 'volunteer-photos');
CREATE POLICY "Anyone can upload volunteer photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'volunteer-photos');
CREATE POLICY "Anyone can update volunteer photos" ON storage.objects FOR UPDATE USING (bucket_id = 'volunteer-photos');
CREATE POLICY "Anyone can delete volunteer photos" ON storage.objects FOR DELETE USING (bucket_id = 'volunteer-photos');
