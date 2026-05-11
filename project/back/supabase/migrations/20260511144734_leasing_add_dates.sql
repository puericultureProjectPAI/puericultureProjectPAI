ALTER TABLE public.leasing_orders
    DROP COLUMN duration_days,
    ADD COLUMN start_date DATE NOT NULL,
    ADD COLUMN end_date   DATE NOT NULL,
    ADD CONSTRAINT leasing_orders_dates_check CHECK (end_date >= start_date);
