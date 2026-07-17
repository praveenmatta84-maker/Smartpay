FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8081

ENTRYPOINT ["java","-jar","target/backend-0.0.1-SNAPSHOT.jar"]