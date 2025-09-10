package com.ravex.backend.dto.centre;

public record CentreDto(Integer codeCentre, String libelleCentre) {
    public CentreDto{
        codeCentre = (codeCentre == null? 0 : codeCentre);
        libelleCentre = (libelleCentre == null? null: libelleCentre.trim());
    }
}
