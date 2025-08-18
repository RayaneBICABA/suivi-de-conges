package com.ravex.backend.domain.model;

import java.time.LocalDate;

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
    @Column(name = "CO_REF", length = 15, nullable = false)
    private String reference;

    
    @Column(name = "CO_JOUR", nullable = false)
    private Integer jours;

    @Column(name = "CO_DATE")
    private LocalDate dateDemande;
}
