package com.ravex.backend.domain.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "AGENT")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agent {
    
    @Id
    @Column(name = "A_MATRICULE", nullable = false, length = 6)
    private String matricule;
    
    @Column(name = "A_NOM", length = 75)
    private String nom;
    
    @Column(name = "A_PRENOM", length = 30)
    private String prenom;
    
    
    @Column(name = "A_FONCTION", length = 50)
    private String fonction;
    
}