package com.versiontracker.routes

import com.versiontracker.model.Library
import com.versiontracker.service.VersionTrackerService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.libraryRoutes() {
    val versionTracker = VersionTrackerService()
    
    get("/libraries") {
        val libraries = versionTracker.loadLibraries()
        call.respond(libraries)
    }
    
    post("/libraries") {
        val library = call.receive<Library>()
        // In a real application, save to database
        call.respond(HttpStatusCode.Created, library)
    }
    
    get("/libraries/{id}/releases") {
        val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)
        val releases = versionTracker.fetchReleases(id)
        call.respond(releases)
    }
} 