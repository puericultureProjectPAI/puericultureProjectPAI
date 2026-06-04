-- 1.  Make sure that the business table uses a UUID as the primary key
CREATE TABLE IF NOT EXISTS public.person (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255),
    name VARCHAR(255),
    city VARCHAR(255),
    street VARCHAR(255),
    genre VARCHAR(1)
);

-- 2.  Create the sync function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.person (id, email, name)
  VALUES (
    new.id, -- The auth.users strict UUID
    new.email,
    new.raw_user_meta_data->>'name' -- Retrieved from the frontend registration
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach the trigger to the registration event
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();