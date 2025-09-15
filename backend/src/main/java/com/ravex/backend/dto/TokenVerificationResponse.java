package com.ravex.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenVerificationResponse {
    private String message;
    private String email;
    private DirectionDto direction;
}
