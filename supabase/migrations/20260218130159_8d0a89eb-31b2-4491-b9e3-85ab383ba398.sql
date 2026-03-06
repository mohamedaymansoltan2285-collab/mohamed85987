
-- Add content field to library_content for full article text
ALTER TABLE public.library_content ADD COLUMN IF NOT EXISTS content text;

-- Add avatar_url and department to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department text;

-- Create storage bucket for library files (PDFs, infographics)
INSERT INTO storage.buckets (id, name, public) VALUES ('library-files', 'library-files', true) ON CONFLICT DO NOTHING;

-- Storage policies for library-files
CREATE POLICY "Library files public read" ON storage.objects FOR SELECT USING (bucket_id = 'library-files');
CREATE POLICY "Library files upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'library-files');
CREATE POLICY "Library files delete" ON storage.objects FOR DELETE USING (bucket_id = 'library-files');

-- Create storage bucket for profile avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
CREATE POLICY "Avatars public read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Avatars upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Avatars update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');

-- Forum posts table
CREATE TABLE public.forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general',
  image_url text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view posts" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Auth users can create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.forum_posts FOR DELETE USING (auth.uid() = user_id);

-- Forum comments table
CREATE TABLE public.forum_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comments" ON public.forum_comments FOR SELECT USING (true);
CREATE POLICY "Auth users can create comments" ON public.forum_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.forum_comments FOR DELETE USING (auth.uid() = user_id);

-- Forum likes table
CREATE TABLE public.forum_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE public.forum_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view likes" ON public.forum_likes FOR SELECT USING (true);
CREATE POLICY "Auth users can like" ON public.forum_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.forum_likes FOR DELETE USING (auth.uid() = user_id);

-- Chat messages table
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id text DEFAULT 'admin',
  message text NOT NULL,
  is_admin boolean DEFAULT false,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own chats" ON public.chat_messages FOR SELECT USING (auth.uid()::text = sender_id::text OR is_admin = false);
CREATE POLICY "Auth users can send messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Admin can insert replies" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Messages readable by all auth" ON public.chat_messages FOR SELECT USING (true);

-- Notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'general',
  link text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Admin can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Enable realtime for chat and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Function to update forum post counts
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_likes_count
AFTER INSERT OR DELETE ON public.forum_likes
FOR EACH ROW EXECUTE FUNCTION public.update_post_likes_count();

CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_comments_count
AFTER INSERT OR DELETE ON public.forum_comments
FOR EACH ROW EXECUTE FUNCTION public.update_post_comments_count();
