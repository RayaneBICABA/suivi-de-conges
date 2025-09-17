package com.ravex.backend.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "direction")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Direction {
    @Id
    @Column(name = "NUM_DR")
    private Long numero;

    @Column(name = "NOM_DR", length = 6)
    private String nom;

    @OneToMany(mappedBy = "direction")
    @JsonIgnore
    private List<Centre> centres;

    @OneToMany(mappedBy = "direction")
    @JsonIgnore
    private List<Utilisateur> utilisateurs;

    @OneToMany(mappedBy = "direction")
    @JsonIgnore
    public List<Agent> agents;
}
