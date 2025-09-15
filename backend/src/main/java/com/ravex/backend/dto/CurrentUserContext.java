package com.ravex.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CurrentUserContext {
    private String email;
    private DirectionDto direction;

    public Long getDirectionNumero() {
        return direction != null ? direction.numero() : null;
    }

    public String getDirectionNom() {
        return direction != null ? direction.nom() : null;
    }
}
