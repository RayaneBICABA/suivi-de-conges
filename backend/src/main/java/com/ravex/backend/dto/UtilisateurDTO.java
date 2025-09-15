package com.ravex.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UtilisateurDTO {
    private String firstname;
    private String lastname;
    private String email;
    private DirectionDto direction;
}
