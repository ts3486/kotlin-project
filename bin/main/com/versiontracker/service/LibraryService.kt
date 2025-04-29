package com.versiontracker.service

import com.versiontracker.model.Library
import com.versiontracker.repository.LibraryRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class LibraryService(
    private val libraryRepository: LibraryRepository
) {
    fun getAllLibraries(): List<Library> = libraryRepository.findAll()
    
    fun getLibraryById(id: Long): Library = libraryRepository.findById(id)
        .orElseThrow { NoSuchElementException("Library not found with id: $id") }
    
    @Transactional
    fun createLibrary(library: Library): Library = libraryRepository.save(library)
    
    @Transactional
    fun updateLibrary(id: Long, library: Library): Library {
        val existingLibrary = getLibraryById(id)
        return libraryRepository.save(library.copy(id = existingLibrary.id))
    }
    
    @Transactional
    fun deleteLibrary(id: Long) {
        if (!libraryRepository.existsById(id)) {
            throw NoSuchElementException("Library not found with id: $id")
        }
        libraryRepository.deleteById(id)
    }
} 