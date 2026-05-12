-- 1. Creating the public bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('puericulture-images', 'puericulture-images', true)
    ON CONFLICT (id) DO NOTHING;

-- 2. Creating the Policy to allow public reading
-- Note: The write will be reserved for the Java backend services by default.
CREATE POLICY "Images Public Access"
ON storage.objects FOR SELECT
                                  USING ( bucket_id = 'puericulture-images' );