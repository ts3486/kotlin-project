package com.versiontracker.routes

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.versiontracker.model.AuthRequest
import com.versiontracker.model.AuthResponse
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.util.*

fun Route.authRoutes() {
    post("/auth/login") {
        val authRequest = call.receive<AuthRequest>()
        
        // In a real application, validate credentials against a database
        if (authRequest.username == "admin" && authRequest.password == "password") {
            val token = JWT.create()
                .withAudience("jwt-audience")
                .withIssuer("http://localhost:8080")
                .withClaim("username", authRequest.username)
                .withExpiresAt(Date(System.currentTimeMillis() + 60000))
                .sign(Algorithm.HMAC256("secret"))
            
            call.respond(AuthResponse(token))
        } else {
            call.respond(HttpStatusCode.Unauthorized, "Invalid credentials")
        }
    }
} 