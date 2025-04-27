package com.versiontracker.service

import com.versiontracker.model.Release
import com.versiontracker.repository.ReleaseRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ReleaseService(
    private val releaseRepository: ReleaseRepository
) {
    fun getAllReleases(): List<Release> = releaseRepository.findAll()
    
    fun getReleaseById(id: Long): Release = releaseRepository.findById(id)
        .orElseThrow { NoSuchElementException("Release not found with id: $id") }
    
    fun getReleasesByLibraryId(libraryId: Long): List<Release> =
        releaseRepository.findByLibraryIdOrderByReleaseDateDesc(libraryId)
    
    @Transactional
    fun createRelease(release: Release): Release = releaseRepository.save(release)
    
    @Transactional
    fun updateRelease(id: Long, release: Release): Release {
        val existingRelease = getReleaseById(id)
        return releaseRepository.save(release.copy(id = existingRelease.id))
    }
    
    @Transactional
    fun deleteRelease(id: Long) {
        if (!releaseRepository.existsById(id)) {
            throw NoSuchElementException("Release not found with id: $id")
        }
        releaseRepository.deleteById(id)
    }
} 