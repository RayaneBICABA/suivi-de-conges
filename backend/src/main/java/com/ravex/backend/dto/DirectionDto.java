package com.ravex.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DirectionDto(
        @NotNull(message = "Le numéro de direction est obligatoire")
        Long numero,

        @NotBlank(message = "Le nom de direction est obligatoire")
        String nom
) {
    public DirectionDto {
        numero = (numero != null ? numero : null);
        nom = (nom != null && !nom.trim().isEmpty() ? nom.trim() : null);
    }
}
