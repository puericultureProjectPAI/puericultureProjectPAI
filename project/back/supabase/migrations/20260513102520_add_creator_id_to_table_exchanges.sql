--- Adding the column creator_id to the exchanges table, which references the id of the user who created the exchange. 
---This will allow us to track who created each exchange and enforce permissions on who can modify or delete an exchange. 
--The ON DELETE CASCADE option ensures that if a user is deleted, all exchanges they created will also be deleted.
ALTER TABLE public.exchanges
ADD COLUMN creator_id UUID NOT NULL
REFERENCES auth.users(id)
ON DELETE CASCADE;