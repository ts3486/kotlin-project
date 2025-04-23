package com.versiontracker

import com.versiontracker.plugins.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import org.jetbrains.exposed.sql.Database

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    // Initialize database
    Database.connect("jdbc:h2:file:./build/db", driver = "org.h2.Driver")
    
    // Configure plugins
    configureSerialization()
    configureCORS()
    configureRouting()
    configureSecurity()
} 