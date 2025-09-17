package com.ravex.backend.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "CONGE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conge {

    @Id
    @Column(name = "CO_REF", length = 50, nullable = false)
    private String reference;

    @Column(name = "CO_JOUR", nullable = false)
    private Integer jours;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "A_MATRICULE", nullable = false)
    @JsonBackReference
    private Agent agent;

    @OneToMany(mappedBy = "conge",fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<SuiviConge> suiviConge;

}
