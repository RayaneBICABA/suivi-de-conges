package com.ravex.backend.Controller;

import com.ravex.backend.dto.centre.CentreDto;
import com.ravex.backend.service.CentreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ravex.backend.util.JwtUtil;
import com.ravex.backend.dto.DirectionDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/centre")
public class CentreController {
    private final CentreService centreService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getAllCentres(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = jwtUtil.extractTokenFromHeader(authHeader);
            if (token == null) return ResponseEntity.status(401).build();
            
            DirectionDto direction = jwtUtil.getDirectionFromToken(token);
            Long directionNumero = direction.numero();
            
            List<CentreDto> centres = centreService.getCentresByDirection(directionNumero);
            return ResponseEntity.ok(centres);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
