package com.ravex.backend.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

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
    @JoinColumn(name = "A_MATRICULE", nullable = false) // FK vers Agent
    @JsonBackReference
    private Agent agent; // <-- Agent unique
}
