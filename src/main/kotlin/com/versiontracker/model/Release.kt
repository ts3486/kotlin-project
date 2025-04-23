package com.versiontracker.model

data class Release(
    val version: String,
    val releaseNotes: String,
    val documentationChanges: List<String>,
    val releaseDate: String,
    val url: String
) 