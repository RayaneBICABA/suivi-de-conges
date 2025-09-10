package com.ravex.backend.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "centre")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Centre {
    @Id
    @Column(name = "C_CODE", nullable = false, unique = true, length = 3)
    private int codeCentre;

    @Column(name = "C_LIBELLE", nullable = false, length = 50)
    private String libelleCentre;

    @OneToMany(mappedBy = "centre")
    @JsonIgnore
    private List<Agent> agents;
}
