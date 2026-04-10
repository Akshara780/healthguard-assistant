
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create vaccination schedules table (system-managed recommended schedules)
CREATE TABLE public.vaccination_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vaccine_name TEXT NOT NULL,
  frequency TEXT NOT NULL,
  age_group TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vaccination_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view schedules"
  ON public.vaccination_schedules FOR SELECT
  USING (true);

-- Seed recommended schedules
INSERT INTO public.vaccination_schedules (vaccine_name, frequency, age_group, description) VALUES
  ('Influenza (Flu)', 'Annually', 'All ages (6+ months)', 'Recommended yearly flu vaccination'),
  ('COVID-19', 'As recommended', 'All ages (6+ months)', 'Follow current health authority guidelines'),
  ('Tetanus/Diphtheria (Td)', 'Every 10 years', 'Adults', 'Booster required every 10 years'),
  ('Shingles (Zoster)', 'Two doses', 'Adults 50+', 'Two-dose series for shingles prevention'),
  ('Pneumococcal', 'One-time series', 'Adults 65+', 'Pneumonia prevention vaccine'),
  ('HPV', '2-3 dose series', 'Ages 9-26', 'Human papillomavirus vaccine series');

-- Create vaccination records table (user dose tracking)
CREATE TABLE public.vaccination_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  date_taken DATE NOT NULL,
  provider TEXT,
  dose TEXT NOT NULL DEFAULT '1st dose',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.vaccination_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own records"
  ON public.vaccination_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own records"
  ON public.vaccination_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records"
  ON public.vaccination_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own records"
  ON public.vaccination_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vaccination_records_updated_at
  BEFORE UPDATE ON public.vaccination_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
