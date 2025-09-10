package com.ravex.backend.dto.centre;

public record SaveAgentDto(String matricule,
                           String nom,
                           String prenom,
                           String fonction,
                           Integer code
                           ) {
    public SaveAgentDto {
        matricule = (matricule != null? matricule.trim() : null);
        nom = (nom == null? null:nom.trim());
        prenom = (prenom != null? prenom.trim():null);
        fonction = (fonction == null? null : fonction.trim());
        code = (code == null? 0 : code);
    }
}