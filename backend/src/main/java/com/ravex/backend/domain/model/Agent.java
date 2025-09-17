package com.ravex.backend.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private List<Conge> conges;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "C_CODE", nullable = false, referencedColumnName = "C_CODE")
    private Centre centre;

    public String getFullName(){
        return this.prenom+" "+this.nom;
    }

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "NUM_DR", referencedColumnName = "NUM_DR")
    private Direction direction;
}