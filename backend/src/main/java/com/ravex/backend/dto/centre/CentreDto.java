package com.ravex.backend.dto.centre;

public record CentreDto(Integer code, String libelleCentre) {
    public CentreDto{
        code = (code == null? 0 : code);
        libelleCentre = (libelleCentre == null? null: libelleCentre.trim());
    }
}
