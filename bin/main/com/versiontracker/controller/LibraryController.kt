package com.versiontracker.controller

import com.versiontracker.model.Library
import com.versiontracker.service.LibraryService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/libraries")
@CrossOrigin(origins = ["*"])
class LibraryController(
    private val libraryService: LibraryService
) {
    @GetMapping
    fun getAllLibraries(): ResponseEntity<List<Library>> =
        ResponseEntity.ok(libraryService.getAllLibraries())
    
    @GetMapping("/{id}")
    fun getLibraryById(@PathVariable id: Long): ResponseEntity<Library> =
        ResponseEntity.ok(libraryService.getLibraryById(id))
    
    @PostMapping
    fun createLibrary(@RequestBody library: Library): ResponseEntity<Library> =
        ResponseEntity.status(HttpStatus.CREATED).body(libraryService.createLibrary(library))
    
    @PutMapping("/{id}")
    fun updateLibrary(
        @PathVariable id: Long,
        @RequestBody library: Library
    ): ResponseEntity<Library> =
        ResponseEntity.ok(libraryService.updateLibrary(id, library))
    
    @DeleteMapping("/{id}")
    fun deleteLibrary(@PathVariable id: Long): ResponseEntity<Unit> {
        libraryService.deleteLibrary(id)
        return ResponseEntity.noContent().build()
    }
    
    @ExceptionHandler(NoSuchElementException::class)
    fun handleNotFound(e: NoSuchElementException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.message)
} 