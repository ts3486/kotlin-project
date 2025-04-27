package com.versiontracker.repository

import com.versiontracker.model.Release
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ReleaseRepository : JpaRepository<Release, Long> {
    fun findByLibraryIdOrderByReleaseDateDesc(libraryId: Long): List<Release>
    fun findByVersion(version: String): Release?
} 