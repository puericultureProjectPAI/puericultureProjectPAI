# ==========================================
# ETAPE 1 : BUILD (Compilation)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

# Optimisation du cache : téléchargement des dépendances [cite: 1, 2]
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Compilation stricte
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# ETAPE 2 : RUNNER (Exécution optimisée)
# ==========================================
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Récupération de l'artefact
COPY --from=builder /build/target/*.jar app.jar

# Optimisation chirurgicale de la RAM pour Render (512 Mo max)
ENV JAVA_OPTS="-Xmx256m -XX:MaxMetaspaceSize=128m -Xss512k -XX:+UseSerialGC"

EXPOSE 8080

# Lancement
ENTRYPOINT sh -c 'java $JAVA_OPTS -jar app.jar'