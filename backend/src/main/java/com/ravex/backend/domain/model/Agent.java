package com.ravex.backend.domain.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "AGENT")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Agent {
    @Id
    @Column(name = "A_MATRICULE", nullable = false, length = 20)
    private String matricule;

    @Column(name = "A_NOM", length = 75)
    private String nom;

    @Column(name = "A_PRENOM", length = 30)
    private String prenom;

    @Column(name = "A_FONCTION", length = 50)
    private String fonction;

    @OneToMany(mappedBy = "agent", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Conge> conges;  // Un agent peut avoir plusieurs congés
}
