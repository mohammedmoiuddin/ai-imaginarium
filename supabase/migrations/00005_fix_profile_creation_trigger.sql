-- Ensure profile creation works for both immediate and email-confirmed signups.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count int;
  base_username text;
  final_username text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;

  base_username := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'username', ''),
    split_part(COALESCE(NEW.email, ''), '@', 1),
    'user'
  );
  base_username := lower(regexp_replace(base_username, '[^a-zA-Z0-9_]+', '_', 'g'));

  IF base_username = '' THEN
    base_username := 'user';
  END IF;

  final_username := base_username;

  IF EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.username = final_username
      AND p.id <> NEW.id
  ) THEN
    final_username := base_username || '_' || left(replace(NEW.id::text, '-', ''), 6);
  END IF;

  INSERT INTO public.profiles (id, username, email, role)
  VALUES (
    NEW.id,
    final_username,
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    username = CASE
      WHEN public.profiles.username IS NULL OR public.profiles.username = '' THEN EXCLUDED.username
      ELSE public.profiles.username
    END;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE OF confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles for existing auth users who are missing one.
WITH missing_users AS (
  SELECT u.id, u.email, u.created_at
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE p.id IS NULL
),
admin_exists AS (
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') AS has_admin
),
ranked_missing AS (
  SELECT
    m.*,
    ROW_NUMBER() OVER (ORDER BY m.created_at, m.id) AS rn
  FROM missing_users m
)
INSERT INTO public.profiles (id, username, email, role)
SELECT
  r.id,
  lower(regexp_replace(split_part(COALESCE(r.email, ''), '@', 1), '[^a-zA-Z0-9_]+', '_', 'g'))
    || '_' || left(replace(r.id::text, '-', ''), 6) AS username,
  r.email,
  CASE
    WHEN (SELECT NOT has_admin FROM admin_exists) AND r.rn = 1 THEN 'admin'::public.user_role
    ELSE 'user'::public.user_role
  END AS role
FROM ranked_missing r;
