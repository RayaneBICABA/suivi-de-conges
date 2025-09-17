package com.ravex.backend.domain.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "SUIVI_CONGE")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuiviConge {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "suivi_conge_seq_gen")
    @SequenceGenerator(name = "suivi_conge_seq_gen", sequenceName = "SUIVI_CONGE_SEQ", allocationSize = 1)
    @Column(name = "SC_NUM")
    private Long id;

    @Column(name = "SC_PERIODE1", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "SC_PERIODE2", nullable = false)
    private LocalDate dateFin;

    @Column(name = "SC_JOUR")
    private Integer jours;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CO_REF", nullable = false)
    @JsonBackReference
    private Conge conge;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "A_MATRICULE", nullable = false)
    @JsonBackReference
    private Agent agent;

}
