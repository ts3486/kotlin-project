package com.versiontracker.controller

import com.versiontracker.model.Release
import com.versiontracker.service.ReleaseService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/releases")
@CrossOrigin(origins = ["*"])
class ReleaseController(
    private val releaseService: ReleaseService
) {
    @GetMapping
    fun getAllReleases(): ResponseEntity<List<Release>> =
        ResponseEntity.ok(releaseService.getAllReleases())
    
    @GetMapping("/{id}")
    fun getReleaseById(@PathVariable id: Long): ResponseEntity<Release> =
        ResponseEntity.ok(releaseService.getReleaseById(id))
    
    @GetMapping("/library/{libraryId}")
    fun getReleasesByLibraryId(@PathVariable libraryId: Long): ResponseEntity<List<Release>> =
        ResponseEntity.ok(releaseService.getReleasesByLibraryId(libraryId))
    
    @PostMapping
    fun createRelease(@RequestBody release: Release): ResponseEntity<Release> =
        ResponseEntity.status(HttpStatus.CREATED).body(releaseService.createRelease(release))
    
    @PutMapping("/{id}")
    fun updateRelease(
        @PathVariable id: Long,
        @RequestBody release: Release
    ): ResponseEntity<Release> =
        ResponseEntity.ok(releaseService.updateRelease(id, release))
    
    @DeleteMapping("/{id}")
    fun deleteRelease(@PathVariable id: Long): ResponseEntity<Unit> {
        releaseService.deleteRelease(id)
        return ResponseEntity.noContent().build()
    }
    
    @ExceptionHandler(NoSuchElementException::class)
    fun handleNotFound(e: NoSuchElementException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.message)
} 