# --- BASE : Dépendances communes ---
FROM node:20-alpine AS front-base
WORKDIR /app/front
COPY front/package*.json ./
RUN npm install
COPY front/ ./

FROM maven:3.9-eclipse-temurin-21 AS back-base
WORKDIR /app/back
# Optimisation du cache Maven
COPY back/pom.xml ./
RUN mvn dependency:go-offline
# Copie du code source
COPY back/src ./src
# CORRECTIF : Copie des fichiers .yml de la racine /back vers le dossier de build
COPY back/*.yml ./src/main/resources/

# --- TARGET: dev ---
FROM back-base AS dev
ENV SPRING_PROFILES_ACTIVE=dev
EXPOSE 8080
CMD ["mvn", "spring-boot:run"]

# --- TARGET: build ---
FROM front-base AS build-front
RUN npm run build

FROM back-base AS build-back
RUN mvn clean package -DskipTests

# --- TARGET: prod ---
FROM eclipse-temurin:21-jre-alpine AS prod
WORKDIR /app
# Définit le profil par défaut, mais peut être écrasé au runtime
ENV SPRING_PROFILES_ACTIVE=prod

# Récupération du JAR (qui contient maintenant les .yml grâce à l'étape back-base)
COPY --from=build-back /app/back/target/puericulture-1.0.0.jar app.jar
# Dossier pour les fichiers statiques du front
COPY --from=build-front /app/front/dist ./static

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]