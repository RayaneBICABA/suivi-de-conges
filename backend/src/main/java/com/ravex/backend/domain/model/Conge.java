package com.ravex.backend.domain.model;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    // Nombre de jours de congé auxquel l'agent a droit par an
    // @Column(name = "CO_JOUR", nullable = false)
    // private Integer jours;

    // @Column(name = "CO_DATE")
    // private LocalDate dateDemande;

    // ========= Relations =========
    /*
     * Un Conge est pris part un et un seul Agent (ManyToOne)
     * Une table CONGE a pour foreign key la primary key de AGENT--Matricule de
     * l'agent(*_*)
     */
    // @ManyToOne
    // @JoinColumn(name = "A_MATRICULE", nullable = false)
    // @JsonIgnore
    // private Agent agent;


    // ========= Methodes Utilitaires =========

}