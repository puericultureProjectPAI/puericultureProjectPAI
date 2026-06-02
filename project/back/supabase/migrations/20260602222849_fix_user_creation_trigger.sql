CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
INSERT INTO public.person (id, email, name, first_name)
VALUES (new.id, new.email, new.raw_user_meta_data ->>'last_name', new.raw_user_meta_data ->>'first_name');
RETURN new;
END;
$$
LANGUAGE plpgsql SECURITY DEFINER;