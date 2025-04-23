plugins {
    kotlin("jvm") version "1.9.22"
    application
    kotlin("plugin.serialization") version "1.9.22"
}

group = "com.versiontracker"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    // Core dependencies
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.16.1")
    implementation("org.slf4j:slf4j-api:2.0.9")
    implementation("ch.qos.logback:logback-classic:1.4.14")

    // Ktor dependencies
    implementation("io.ktor:ktor-server-core:2.3.7")
    implementation("io.ktor:ktor-server-netty:2.3.7")
    implementation("io.ktor:ktor-server-content-negotiation:2.3.7")
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.7")
    implementation("io.ktor:ktor-server-cors:2.3.7")
    implementation("io.ktor:ktor-server-auth:2.3.7")
    implementation("io.ktor:ktor-server-auth-jwt:2.3.7")

    // Database
    implementation("org.jetbrains.exposed:exposed-core:0.44.1")
    implementation("org.jetbrains.exposed:exposed-dao:0.44.1")
    implementation("org.jetbrains.exposed:exposed-jdbc:0.44.1")
    implementation("com.h2database:h2:2.2.224")

    testImplementation(kotlin("test"))
}

application {
    mainClass.set("com.versiontracker.ApplicationKt")
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(17)
} 