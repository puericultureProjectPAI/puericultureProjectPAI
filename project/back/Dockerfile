# ==========================================
# ETAPE 1 : BUILD (Compilation)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

# Optimisation du cache Docker : on copie d'abord uniquement le POM
COPY pom.xml .
# Téléchargement des dépendances hors ligne (accélère les builds suivants)
RUN mvn dependency:go-offline -B

# Copie du code source
COPY src ./src
# Compilation sans lancer les tests (déjà gérés par la CI)
RUN mvn clean package -DskipTests

# ==========================================
# ETAPE 2 : PRODUCTION RUNNER
# ==========================================
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Définit le profil par défaut
ENV SPRING_PROFILES_ACTIVE=prod

# Récupération de l'artefact compilé
COPY --from=builder /build/target/*.jar app.jar

# Partie indispensable pour l'utilisation de Render, limité à 512 Mo de mémoire
# Variables d'environnement pour l'optimisation mémoire
# -Xmx256m : Limite le tas (Heap) à 256 Mo (garde de la place pour le Metaspace et l'OS)
# -XX:MaxMetaspaceSize=128m : Limite la mémoire pour le chargement des classes Spring
# -Xss512k : Réduit la taille de la pile par thread (Tomcat crée beaucoup de threads)
# -XX:+UseSerialGC : Force le Garbage Collector séquentiel (consomme moins de RAM que le G1GC par défaut, idéal pour 1 CPU)
ENV JAVA_OPTS="-Xmx256m -XX:MaxMetaspaceSize=128m -Xss512k -XX:+UseSerialGC"

EXPOSE 8080

# Lancement avec les options imposées
ENTRYPOINT sh -c 'java $JAVA_OPTS -jar app.jar'