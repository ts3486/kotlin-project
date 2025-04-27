package com.versiontracker.repository

import com.versiontracker.model.Library
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface LibraryRepository : JpaRepository<Library, Long> {
    fun findByName(name: String): Library?
} 