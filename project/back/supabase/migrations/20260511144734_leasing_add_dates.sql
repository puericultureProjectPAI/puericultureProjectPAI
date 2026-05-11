ALTER TABLE public.leasing_orders
    ADD COLUMN start_date DATE NOT NULL,
    ADD COLUMN end_date   DATE NOT NULL,
    ADD CONSTRAINT leasing_orders_dates_check CHECK (end_date >= start_date);
