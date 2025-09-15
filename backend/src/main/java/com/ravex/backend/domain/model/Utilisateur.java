package com.ravex.backend.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "UTILISATEUR")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Utilisateur {
    
    // Clé primaire - Changement principal ici
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_utilisateur")
    @SequenceGenerator(
        name = "seq_utilisateur", 
        sequenceName = "SEQ_UTILISATEUR", 
        allocationSize = 1
    )
    @Column(name = "user_id")
    private Long userId;
    
    // Nom d'utilisateur
    @Column(name = "username", length = 50, nullable = false)
    private String username;
    
    // Nom
    @Column(name = "lastname", length = 100, nullable = false)
    private String lastname;
    
    // Prenom
    @Column(name = "firstname", length = 100, nullable = false)
    private String firstname;
    
    // Mot de passe
    @Column(name = "password", nullable = false)
    private String password;
    
    // Email
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    // Enable / Disable
    @Column(name = "enabled")
    private boolean enabled = true;
    
    @Column(name = "role", nullable = false)
    private String role = "USER";


    // ========= RELATION ENTRE DIRECTION ET UTILISATEUR  =========
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "nombre")
    private Direction direction;

}