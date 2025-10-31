# Stage 1: Build the application using a Maven image with Java 17
FROM maven:3.9.6-eclipse-temurin-17-jammy AS build

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper files and the pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Package the application, skipping tests
RUN ./mvnw package -DskipTests

# Stage 2: Create the final lightweight image using a Java 17 JRE
FROM eclipse-temurin:17-jre-jammy

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the 'build' stage
# The JAR name is based on your pom.xml <artifactId> and <version>
COPY --from=build /app/target/user-service-0.0.1-SNAPSHOT.jar /app/app.jar

# Expose the default Spring Boot port (8080)
# Your application.properties doesn't set a port, so it will use the default
# or one provided by the Config Server at runtime.
EXPOSE 8080

# Command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "/app/app.jar"]