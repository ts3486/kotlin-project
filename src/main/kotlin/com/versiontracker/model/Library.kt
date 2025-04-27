package com.versiontracker.model

import jakarta.persistence.*

@Entity
@Table(name = "libraries")
data class Library(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,
    
    @Column(nullable = false)
    val name: String,
    
    @Column(nullable = false)
    val currentVersion: String,
    
    @Column(nullable = false)
    val repositoryUrl: String,
    
    @OneToMany(mappedBy = "library", cascade = [CascadeType.ALL], orphanRemoval = true)
    val releases: MutableList<Release> = mutableListOf()
) 