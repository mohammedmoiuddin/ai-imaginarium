-- Create user role enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text,
  role public.user_role NOT NULL DEFAULT 'user',
  progress_score integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create prompts library table
CREATE TABLE public.prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  prompt_text text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_level text NOT NULL,
  question text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_option text NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  explanation text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create user quiz attempts table
CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  selected_option text NOT NULL,
  is_correct boolean NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now()
);

-- Create forum discussions table
CREATE TABLE public.discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create discussion replies table
CREATE TABLE public.discussion_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id uuid NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  badge_icon text NOT NULL,
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_name text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  UNIQUE(user_id, module_name)
);

-- Create indexes
CREATE INDEX idx_prompts_category ON public.prompts(category);
CREATE INDEX idx_prompts_difficulty ON public.prompts(difficulty);
CREATE INDEX idx_quizzes_module ON public.quizzes(module_level);
CREATE INDEX idx_discussions_user ON public.discussions(user_id);
CREATE INDEX idx_discussions_created ON public.discussions(created_at DESC);
CREATE INDEX idx_replies_discussion ON public.discussion_replies(discussion_id);
CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX idx_user_progress_user ON public.user_progress(user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  extracted_username text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract username from email (remove @miaoda.com)
  extracted_username := REPLACE(NEW.email, '@miaoda.com', '');
  
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    extracted_username,
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Create helper function for admin check
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- RLS Policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- Create public view for profiles
CREATE VIEW public.public_profiles AS
  SELECT id, username, role, progress_score, created_at FROM profiles;

-- RLS Policies for prompts (read-only for all authenticated users)
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view prompts" ON public.prompts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage prompts" ON public.prompts
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- RLS Policies for quizzes
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quizzes" ON public.quizzes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage quizzes" ON public.quizzes
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- RLS Policies for quiz attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attempts" ON public.quiz_attempts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own attempts" ON public.quiz_attempts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all attempts" ON public.quiz_attempts
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

-- RLS Policies for discussions
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view discussions" ON public.discussions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create discussions" ON public.discussions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own discussions" ON public.discussions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own discussions" ON public.discussions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all discussions" ON public.discussions
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- RLS Policies for discussion replies
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view replies" ON public.discussion_replies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create replies" ON public.discussion_replies
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies" ON public.discussion_replies
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own replies" ON public.discussion_replies
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements" ON public.achievements
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage achievements" ON public.achievements
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

-- RLS Policies for user achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view all user achievements" ON public.user_achievements
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can insert achievements" ON public.user_achievements
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own progress" ON public.user_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Insert sample prompts
INSERT INTO public.prompts (category, title, prompt_text, difficulty) VALUES
('Nature', 'Serene Mountain Lake', 'A serene mountain lake at sunrise, crystal clear water reflecting snow-capped peaks, surrounded by pine forests, misty atmosphere, golden hour lighting, photorealistic, 8k resolution', 'basic'),
('Nature', 'Mystical Forest', 'An enchanted forest with bioluminescent plants, ancient twisted trees, ethereal fog, magical atmosphere, fantasy art style, vibrant colors, detailed foliage, cinematic lighting', 'intermediate'),
('Nature', 'Underwater Coral Reef', 'Vibrant coral reef ecosystem, diverse marine life, schools of tropical fish, crystal clear turquoise water, sun rays penetrating from surface, macro photography style, National Geographic quality', 'advanced'),
('Technology', 'Futuristic City', 'A futuristic cyberpunk city at night, neon lights, flying cars, holographic advertisements, rain-slicked streets, towering skyscrapers, blade runner aesthetic, cinematic composition', 'intermediate'),
('Technology', 'AI Robot Portrait', 'Humanoid AI robot, sleek metallic design, glowing blue eyes, intricate circuitry visible, studio lighting, professional photography, high detail, 4k resolution', 'basic'),
('Technology', 'Virtual Reality World', 'Person immersed in virtual reality, digital particles flowing around them, matrix-style code in background, neon blue and purple color scheme, futuristic interface elements, concept art style', 'advanced'),
('Education', 'Ancient Library', 'Grand ancient library with towering bookshelves, ornate architecture, warm candlelight, leather-bound books, wooden reading tables, atmospheric dust particles in light beams, renaissance painting style', 'intermediate'),
('Education', 'Modern Classroom', 'Modern interactive classroom, students using tablets, holographic displays, collaborative learning environment, bright natural lighting, contemporary architecture, professional photography', 'basic'),
('Education', 'Scientific Laboratory', 'State-of-the-art scientific laboratory, advanced equipment, researchers in lab coats, microscopes and test tubes, clean modern design, professional lighting, detailed instrumentation', 'intermediate'),
('Cinematic', 'Epic Battle Scene', 'Epic fantasy battle scene, warriors in armor, dramatic lighting, dust and debris in air, dynamic action poses, cinematic wide angle, high contrast, movie poster quality', 'advanced'),
('Cinematic', 'Emotional Portrait', 'Cinematic portrait of a person, dramatic side lighting, emotional expression, shallow depth of field, film grain, anamorphic lens flare, professional color grading', 'intermediate'),
('Cinematic', 'Sunset Silhouette', 'Silhouette of person standing on cliff edge at sunset, dramatic sky with vibrant colors, wide cinematic aspect ratio, inspirational mood, professional photography', 'basic');

-- Insert sample quizzes
INSERT INTO public.quizzes (module_level, question, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
('basics', 'What is the primary purpose of a prompt in AI image generation?', 'To confuse the AI', 'To provide instructions and context for the desired output', 'To make the process slower', 'To limit creativity', 'B', 'Prompts serve as instructions that guide the AI to generate images matching your vision.'),
('basics', 'Which element is essential in every good prompt?', 'Random words', 'A clear subject or main focus', 'Spelling mistakes', 'Contradictory descriptions', 'B', 'Every effective prompt needs a clear subject to tell the AI what to generate.'),
('basics', 'What does adding style keywords to a prompt accomplish?', 'Makes the prompt longer', 'Defines the artistic or visual style of the output', 'Confuses the AI model', 'Reduces image quality', 'B', 'Style keywords help specify the artistic direction, such as "photorealistic", "oil painting", or "anime style".'),
('better', 'What is the benefit of specifying lighting in your prompt?', 'It makes the prompt more complex', 'It helps control mood and atmosphere', 'It is not important', 'It only works for outdoor scenes', 'B', 'Lighting specifications like "golden hour" or "dramatic lighting" significantly impact the mood and quality of the generated image.'),
('better', 'Which prompt is more effective: "cat" or "fluffy orange cat sitting on windowsill, soft natural lighting, cozy atmosphere"?', 'The first one', 'The second one', 'Both are equally effective', 'Neither will work', 'B', 'The second prompt provides specific details about appearance, setting, lighting, and mood, leading to better results.'),
('better', 'What does adding quality parameters like "8k resolution" or "highly detailed" do?', 'Wastes tokens', 'Guides the AI to generate higher quality outputs', 'Makes generation slower', 'Has no effect', 'B', 'Quality parameters signal to the AI that you want a high-fidelity, detailed result.'),
('advanced', 'What is the purpose of using negative prompts?', 'To be pessimistic', 'To specify what you do not want in the image', 'To confuse the model', 'To reduce generation time', 'B', 'Negative prompts help exclude unwanted elements, improving the final output.'),
('advanced', 'How can you control composition in AI-generated images?', 'You cannot control it', 'By using terms like "rule of thirds", "centered", or "wide angle"', 'By using random words', 'By making the prompt shorter', 'B', 'Compositional terms guide the AI on how to frame and arrange elements in the image.'),
('advanced', 'What is prompt weighting or emphasis?', 'Making the prompt longer', 'Assigning importance to specific elements using syntax like (keyword:1.5)', 'Using capital letters', 'Repeating words multiple times', 'B', 'Prompt weighting allows you to emphasize certain elements, making them more prominent in the final image.'),
('guide', 'When writing a prompt, what should you define first?', 'The color scheme', 'The main subject', 'The background', 'The lighting', 'B', 'Always start with the main subject - what you want the AI to generate.'),
('guide', 'What is a common mistake in prompt writing?', 'Being too specific', 'Being vague and using contradictory descriptions', 'Using descriptive adjectives', 'Specifying the style', 'B', 'Vague or contradictory prompts confuse the AI and lead to poor results.'),
('guide', 'How can you improve a prompt that generates inconsistent results?', 'Make it shorter', 'Add more specific details and remove contradictions', 'Use random words', 'Give up and try a different subject', 'B', 'Adding clarity and removing contradictions helps the AI understand exactly what you want.');

-- Insert sample achievements
INSERT INTO public.achievements (name, description, badge_icon, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your first learning module', '🎯', 'modules_completed', 1),
('Knowledge Seeker', 'Complete 3 learning modules', '📚', 'modules_completed', 3),
('Master Learner', 'Complete all learning modules', '🎓', 'modules_completed', 5),
('Quiz Novice', 'Pass your first quiz', '✅', 'quizzes_passed', 1),
('Quiz Expert', 'Pass 5 quizzes with 80% or higher', '🏆', 'quizzes_passed', 5),
('Prompt Creator', 'Use the Prompt Playground 10 times', '✨', 'playground_uses', 10),
('Community Member', 'Create your first forum discussion', '💬', 'discussions_created', 1),
('Active Contributor', 'Post 10 replies in the forum', '🗣️', 'replies_posted', 10),
('Prompt Collector', 'Copy 5 prompts from the library', '📋', 'prompts_copied', 5),
('Early Adopter', 'Join the platform', '🌟', 'account_created', 1);