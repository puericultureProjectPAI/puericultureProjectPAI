# Puericulture project PAI

# Launch docker

## Development
Builds an image containing Maven to run the app in watch/debug mode.
- `docker build --target dev -t puericulture:dev .`
- `docker run -p 8080:8080 puericulture:dev`

## Production
Builds a slim production image (JRE only) with compiled assets.
- `docker build --target prod -t puericulture:prod .`
- `docker run -p 8080:8080 puericulture:prod`