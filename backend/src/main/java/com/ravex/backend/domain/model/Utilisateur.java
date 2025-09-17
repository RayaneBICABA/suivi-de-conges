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

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_utilisateur")
    @SequenceGenerator(
        name = "seq_utilisateur", 
        sequenceName = "SEQ_UTILISATEUR", 
        allocationSize = 1
    )
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "username", length = 50, nullable = false)
    private String username;

    @Column(name = "lastname", length = 100, nullable = false)
    private String lastname;

    @Column(name = "firstname", length = 100, nullable = false)
    private String firstname;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "enabled")
    private boolean enabled = true;
    
    @Column(name = "role", nullable = false)
    private String role = "USER";

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "NUM_DR")
    private Direction direction;

}