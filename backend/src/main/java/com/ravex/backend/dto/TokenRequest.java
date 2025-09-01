package com.ravex.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenRequest {
    @NotBlank(message = "Token obligatoire")
    private String token;
}
