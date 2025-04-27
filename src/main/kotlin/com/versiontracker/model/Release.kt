package com.versiontracker.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "releases")
data class Release(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "library_id", nullable = false)
    val library: Library,
    
    @Column(nullable = false)
    val version: String,
    
    @Column(nullable = false)
    val releaseDate: LocalDateTime,
    
    @Column(columnDefinition = "TEXT")
    val releaseNotes: String? = null,
    
    @Column(columnDefinition = "TEXT")
    val documentationChanges: String? = null
) 