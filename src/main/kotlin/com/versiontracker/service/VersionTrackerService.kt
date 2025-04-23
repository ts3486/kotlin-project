package com.versiontracker.service

import com.fasterxml.jackson.module.kotlin.readValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.versiontracker.model.Library
import com.versiontracker.model.Release
import com.versiontracker.model.UpdateSource
import okhttp3.OkHttpClient
import okhttp3.Request
import org.slf4j.LoggerFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File

class VersionTrackerService {
    private val logger = LoggerFactory.getLogger(VersionTrackerService::class.java)
    private val httpClient = OkHttpClient()
    private val objectMapper = jacksonObjectMapper()
    private val configFile = File("libraries.json")

    suspend fun startTracking() {
        val libraries = loadLibraries()
        val updates = mutableListOf<Release>()

        for (library in libraries) {
            try {
                val releases = when (library.updateSource) {
                    UpdateSource.GITHUB -> fetchGitHubReleases(library)
                    UpdateSource.NPM -> fetchNpmReleases(library)
                    UpdateSource.PYPI -> fetchPypiReleases(library)
                    UpdateSource.MAVEN -> fetchMavenReleases(library)
                    UpdateSource.DOCKER_HUB -> fetchDockerHubReleases(library)
                }
                
                val latestRelease = releases.firstOrNull()
                if (latestRelease != null && latestRelease.version != library.currentVersion) {
                    updates.add(latestRelease)
                }
            } catch (e: Exception) {
                logger.error("Failed to check releases for ${library.name}", e)
            }
        }

        if (updates.isNotEmpty()) {
            notifyUpdates(updates)
        } else {
            logger.info("No updates found")
        }
    }

    private fun loadLibraries(): List<Library> {
        return if (configFile.exists()) {
            objectMapper.readValue(configFile)
        } else {
            // Create default configuration if file doesn't exist
            val defaultLibraries = listOf(
                // Web Frameworks
                Library(
                    name = "Next.js",
                    updateSource = UpdateSource.GITHUB,
                    sourceIdentifier = "vercel/next.js",
                    documentationUrl = "https://nextjs.org/docs",
                    currentVersion = "14.1.0"
                ),
                Library(
                    name = "React",
                    updateSource = UpdateSource.NPM,
                    sourceIdentifier = "react",
                    documentationUrl = "https://react.dev",
                    currentVersion = "18.2.0"
                ),
                Library(
                    name = "Vue.js",
                    updateSource = UpdateSource.GITHUB,
                    sourceIdentifier = "vuejs/vue",
                    documentationUrl = "https://vuejs.org/guide",
                    currentVersion = "3.4.0"
                ),
                Library(
                    name = "Angular",
                    updateSource = UpdateSource.GITHUB,
                    sourceIdentifier = "angular/angular",
                    documentationUrl = "https://angular.io/docs",
                    currentVersion = "17.0.0"
                ),
                
                // Mobile Frameworks
                Library(
                    name = "Flutter",
                    updateSource = UpdateSource.GITHUB,
                    sourceIdentifier = "flutter/flutter",
                    documentationUrl = "https://docs.flutter.dev",
                    currentVersion = "3.19.0"
                ),
                Library(
                    name = "React Native",
                    updateSource = UpdateSource.GITHUB,
                    sourceIdentifier = "facebook/react-native",
                    documentationUrl = "https://reactnative.dev/docs",
                    currentVersion = "0.73.0"
                ),
                
                // Backend Frameworks
                Library(
                    name = "Spring Boot",
                    updateSource = UpdateSource.MAVEN,
                    sourceIdentifier = "org.springframework.boot:spring-boot",
                    documentationUrl = "https://docs.spring.io/spring-boot/docs/current/reference/html",
                    currentVersion = "3.2.0"
                ),
                Library(
                    name = "Express.js",
                    updateSource = UpdateSource.NPM,
                    sourceIdentifier = "express",
                    documentationUrl = "https://expressjs.com",
                    currentVersion = "4.18.0"
                ),
                
                // Database Tools
                Library(
                    name = "Prisma",
                    updateSource = UpdateSource.GITHUB,
                    sourceIdentifier = "prisma/prisma",
                    documentationUrl = "https://www.prisma.io/docs",
                    currentVersion = "5.9.0"
                ),
                Library(
                    name = "TypeORM",
                    updateSource = UpdateSource.GITHUB,
                    sourceIdentifier = "typeorm/typeorm",
                    documentationUrl = "https://typeorm.io",
                    currentVersion = "0.3.20"
                )
            )
            objectMapper.writeValue(configFile, defaultLibraries)
            defaultLibraries
        }
    }

    private suspend fun fetchGitHubReleases(library: Library): List<Release> = withContext(Dispatchers.IO) {
        val url = "https://api.github.com/repos/${library.sourceIdentifier}/releases"
        val request = Request.Builder()
            .url(url)
            .header("Accept", "application/vnd.github.v3+json")
            .build()
        
        httpClient.newCall(request).execute().use { response ->
            val json = response.body?.string() ?: throw Exception("Empty response")
            val releases = objectMapper.readTree(json)
            
            releases.map { release ->
                Release(
                    version = release.path("tag_name").asText(),
                    releaseNotes = release.path("body").asText(),
                    documentationChanges = extractDocumentationChanges(release.path("body").asText()),
                    releaseDate = release.path("published_at").asText(),
                    url = release.path("html_url").asText()
                )
            }
        }
    }

    private suspend fun fetchNpmReleases(library: Library): List<Release> = withContext(Dispatchers.IO) {
        val url = "https://registry.npmjs.org/${library.sourceIdentifier}"
        val request = Request.Builder().url(url).build()
        
        httpClient.newCall(request).execute().use { response ->
            val json = response.body?.string() ?: throw Exception("Empty response")
            val packageInfo = objectMapper.readTree(json)
            val versions = packageInfo.path("versions")
            
            versions.fields().asSequence().map { (version, info) ->
                Release(
                    version = version,
                    releaseNotes = info.path("description").asText(),
                    documentationChanges = extractDocumentationChanges(info.path("description").asText()),
                    releaseDate = info.path("time").asText(),
                    url = "https://www.npmjs.com/package/${library.sourceIdentifier}/v/$version"
                )
            }.toList()
        }
    }

    private suspend fun fetchPypiReleases(library: Library): List<Release> = withContext(Dispatchers.IO) {
        val url = "https://pypi.org/pypi/${library.sourceIdentifier}/json"
        val request = Request.Builder().url(url).build()
        
        httpClient.newCall(request).execute().use { response ->
            val json = response.body?.string() ?: throw Exception("Empty response")
            val packageInfo = objectMapper.readTree(json)
            val releases = packageInfo.path("releases")
            
            releases.fields().asSequence().map { (version, info) ->
                Release(
                    version = version,
                    releaseNotes = info.path("description").asText(),
                    documentationChanges = extractDocumentationChanges(info.path("description").asText()),
                    releaseDate = info.path("upload_time").asText(),
                    url = "https://pypi.org/project/${library.sourceIdentifier}/$version/"
                )
            }.toList()
        }
    }

    private suspend fun fetchMavenReleases(library: Library): List<Release> = withContext(Dispatchers.IO) {
        val (groupId, artifactId) = library.sourceIdentifier.split(":")
        val url = "https://search.maven.org/solrsearch/select?q=g:${groupId}+AND+a:${artifactId}&rows=20&wt=json"
        val request = Request.Builder().url(url).build()
        
        httpClient.newCall(request).execute().use { response ->
            val json = response.body?.string() ?: throw Exception("Empty response")
            val result = objectMapper.readTree(json)
            val docs = result.path("response").path("docs")
            
            docs.map { doc ->
                Release(
                    version = doc.path("v").asText(),
                    releaseNotes = doc.path("description").asText(),
                    documentationChanges = extractDocumentationChanges(doc.path("description").asText()),
                    releaseDate = doc.path("timestamp").asText(),
                    url = "https://mvnrepository.com/artifact/$groupId/$artifactId"
                )
            }
        }
    }

    private suspend fun fetchDockerHubReleases(library: Library): List<Release> = withContext(Dispatchers.IO) {
        val url = "https://hub.docker.com/v2/repositories/${library.sourceIdentifier}/tags"
        val request = Request.Builder().url(url).build()
        
        httpClient.newCall(request).execute().use { response ->
            val json = response.body?.string() ?: throw Exception("Empty response")
            val result = objectMapper.readTree(json)
            val tags = result.path("results")
            
            tags.map { tag ->
                Release(
                    version = tag.path("name").asText(),
                    releaseNotes = tag.path("full_description").asText(),
                    documentationChanges = extractDocumentationChanges(tag.path("full_description").asText()),
                    releaseDate = tag.path("last_updated").asText(),
                    url = "https://hub.docker.com/r/${library.sourceIdentifier}/tags"
                )
            }
        }
    }

    private fun extractDocumentationChanges(releaseNotes: String): List<String> {
        return releaseNotes.lines()
            .filter { line -> 
                line.contains("docs", ignoreCase = true) || 
                line.contains("documentation", ignoreCase = true) ||
                line.contains("guide", ignoreCase = true) ||
                line.contains("tutorial", ignoreCase = true) ||
                line.contains("api", ignoreCase = true)
            }
            .map { it.trim() }
    }

    private fun notifyUpdates(updates: List<Release>) {
        logger.info("Found ${updates.size} updates:")
        updates.forEach { release ->
            logger.info("""
                |New Release: ${release.version}
                |Release Date: ${release.releaseDate}
                |URL: ${release.url}
                |
                |Documentation Changes:
                |${release.documentationChanges.joinToString("\n") { "- $it" }}
                |
                |Full Release Notes:
                |${release.releaseNotes}
                |""".trimMargin())
        }
    }
} 