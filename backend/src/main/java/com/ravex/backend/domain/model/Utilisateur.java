package com.ravex.backend.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table (name = "UTILISATEUR")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Utilisateur {
    // Clé primaire
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    // Nom d'utilisateur
    @Column(name = "username", length =  50, nullable = false)
    private String username;

    // Nom
    @Column(name = "lastname", length = 100, nullable = false)
    private String lastname;

    // Prenom
    @Column(name = "firstname", length = 100, nullable = false)
    private String firstname;

    // Mot de passe
    @Column(name = "password", nullable = false )
    private String password;

    // Email
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    // Enable / Disable
    @Column(name = "enabled")
    private boolean enabled = true;

    // Role will be implemented later
}
