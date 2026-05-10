-- Allow authenticated users to self-heal missing profile rows.
-- This supports app-side recovery when a profile trigger didn't run.
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND role = 'user'::public.user_role
  );
