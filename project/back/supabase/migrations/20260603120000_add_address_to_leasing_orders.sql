ALTER TABLE public.leasing_orders
ADD COLUMN delivery_street VARCHAR(255),
ADD COLUMN delivery_zip_code VARCHAR(20),
ADD COLUMN delivery_city VARCHAR(255);
