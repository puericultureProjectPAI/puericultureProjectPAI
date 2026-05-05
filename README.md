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
- `docker build --target dev -t puericulture:dev .`
- `docker run -p 8080:8080 puericulture:dev`

## Production
Builds a slim production image (JRE only) with compiled assets.
- `docker build --target prod -t puericulture:prod .`
- `docker run -p 8080:8080 puericulture:prod`