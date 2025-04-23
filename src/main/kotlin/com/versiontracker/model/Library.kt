package com.versiontracker.model

data class Library(
    val name: String,
    val updateSource: UpdateSource,
    val sourceIdentifier: String, // e.g., "vercel/next.js" for GitHub, "next" for NPM
    val documentationUrl: String,
    val currentVersion: String,
    val updateCheckUrl: String? = null // Optional custom URL for checking updates
) 