package com.versiontracker.plugins

import com.versiontracker.routes.*
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    routing {
        // Public routes
        authRoutes()
        
        // Protected routes
        authenticate("auth-jwt") {
            libraryRoutes()
            releaseRoutes()
            userRoutes()
        }
    }
} 