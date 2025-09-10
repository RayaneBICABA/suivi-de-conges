package com.ravex.backend.configuration;

import lombok.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
public class NumeroCentre {
    // Le numéro de centre est injecté depuis application.properties
    @Value("${app.centre}")
    private int numCentre;
}
