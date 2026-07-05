# ── Stage 1: Build the Spring Boot JAR ────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN ./mvnw install -DskipTests

# ── Stage 2: Runtime image with Python3 + Node.js + Java ──────────────────────
FROM eclipse-temurin:21-jre-alpine

# Install Python3 and Node.js so the code execution service can run user submissions
RUN apk add --no-cache python3 nodejs

VOLUME /tmp
WORKDIR /app
COPY --from=build /workspace/app/target/*.jar app.jar

# Run with non-root user for better security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

EXPOSE 8080

# Render sets PORT env variable; Spring Boot reads it via ${PORT:8081}
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
