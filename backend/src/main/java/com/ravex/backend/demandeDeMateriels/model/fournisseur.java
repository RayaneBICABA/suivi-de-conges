package com.ravex.backend.demandeDeMateriels.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "FOURNIS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class fournisseur {
    @Id
    @Column(name = "FR_CODE", length = 5)
    private String code;

    @Column(name = "FR_NOM", length = 50)
    private String nom;

    @Column(name = "FR_TEL", length = 20)
    private String telephone;

    @Column(name = "FR_IFU", length = 20)
    private String numero;

    @Column(name = "FR_IF_ON", length = 1)
    private String statusNumero;

    @Column(name = "FR_OWNER", length = 15)
    private String owner; // Agent qui enregistre le fournisseur: Gerer automatiquement

    @Column(name = "FR_TERMINAL", length = 25)
    private String machine; // Nom de la machine de l'agent qui enregistre le fournisseur

    @Column(name = "FR_BP", length = 50)
    private String addresse;

    @Column(name = "FR_DATE_SAISIE")
    private LocalDate registeredAt; // Enregistrer automatiquement

    @Column(name = "FR_PROF", length = 50)
    private String profession;
}
