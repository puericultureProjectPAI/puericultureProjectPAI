# Puericulture project PAI

# Create your dev environment

## Install dependencies
- `brew install supabase/tap/supabase`

## Launch environment models
- In the folder `project/back`, launch: `supabase start`

## Personalise your environment
In the file `/project/back`, create the file `.env`, and complete it with the information of your local supabase

# Launch docker

## Development
Builds an image containing Maven to run the app in watch/debug mode.
- ```bash
  docker build --target dev -t puericulture:dev .
  ```
- ```bash
  docker run -p 8080:8080 puericulture:dev
  ```

## Production
Builds a slim production image (JRE only) with compiled assets.
- ```bash
    docker build --target prod -t puericulture:prod .
  ```
- ```bash
    docker run -p 8080:8080 puericulture:prod
  ```

# Create a modification of the data base
> Note : This requires the validation of tech leads and CTO before merging a change on the data base

## 1. Create Migration
Generate a new timestamped SQL file:
```bash
supabase migration new your_feature_name
```

## 2. Implementation
- Edit the generated file in supabase/migrations/.
- Use PostgreSQL syntax (DDL).

## 3. Local Test
Apply changes and refresh your local environment:
```bash
supabase db reset
```
Verify that `supabase/seed.sql` still works and your features aren't broken.

## 4. Review & Merge
- Once everything is done open a Pull Request and wait for review of Tech Lead/CTO