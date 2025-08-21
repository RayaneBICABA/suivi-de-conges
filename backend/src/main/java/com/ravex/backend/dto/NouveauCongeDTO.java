package com.ravex.backend.dto;

import lombok.Data;

@Data
public class NouveauCongeDTO {
    private String reference;
    private Integer jours;
    private String matriculeAgent;
}
