package com.ravex.backend.util;

import com.ravex.backend.dto.DirectionDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final Key key;
    private final long expiration;

    public JwtUtil(@Value("${jwt.secret}") String secret, 
                   @Value("${jwt.expiration}") long expiration) {
        this.key = Keys.hmacShaKeyFor(java.util.Base64.getDecoder().decode(secret));
        this.expiration = expiration;
    }

    // Méthode surchargée pour maintenir la compatibilité
    public String generateToken(String email) {
        return generateToken(email, null, null);
    }

    // Nouvelle méthode avec direction
    public String generateToken(String email, Long directionNumero, String directionNom) {
        var builder = Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration));

        // Ajouter les informations de direction si disponibles
        if (directionNumero != null) {
            builder.claim("directionNumero", directionNumero);
        }
        if (directionNom != null && !directionNom.trim().isEmpty()) {
            builder.claim("directionNom", directionNom);
        }

        return builder.signWith(key).compact();
    }

    public String getEmailFromToken(String token) throws JwtException {
        return getClaims(token).getSubject();
    }

    public DirectionDto getDirectionFromToken(String token) throws JwtException {
        Claims claims = getClaims(token);
        Long directionNumero = null;
        String directionNom = null;

        // Récupérer le numéro de direction
        Object numeroObj = claims.get("directionNumero");
        if (numeroObj != null) {
            if (numeroObj instanceof Integer) {
                directionNumero = ((Integer) numeroObj).longValue();
            } else if (numeroObj instanceof Long) {
                directionNumero = (Long) numeroObj;
            }
        }

        // Récupérer le nom de direction
        Object nomObj = claims.get("directionNom");
        if (nomObj instanceof String) {
            directionNom = (String) nomObj;
        }

        return new DirectionDto(directionNumero, directionNom);
    }

    public Long getDirectionNumeroFromToken(String token) throws JwtException {
        Claims claims = getClaims(token);
        Object numeroObj = claims.get("directionNumero");

        if (numeroObj != null) {
            if (numeroObj instanceof Integer) {
                return ((Integer) numeroObj).longValue();
            } else if (numeroObj instanceof Long) {
                return (Long) numeroObj;
            }
        }
        return null;
    }

    public String getDirectionNomFromToken(String token) throws JwtException {
        Claims claims = getClaims(token);
        Object nomObj = claims.get("directionNom");
        return nomObj instanceof String ? (String) nomObj : null;
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = getClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (JwtException e) {
            return false;
        }
    }

    public boolean isTokenExpired(String token) throws JwtException {
        return getClaims(token).getExpiration().before(new Date());
    }

    private Claims getClaims(String token) throws JwtException {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractTokenFromHeader(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    // Méthode utilitaire pour récupérer toutes les informations utilisateur du token
    public UserTokenInfo getUserInfoFromToken(String token) throws JwtException {
        Claims claims = getClaims(token);
        String email = claims.getSubject();
        DirectionDto direction = getDirectionFromToken(token);

        return new UserTokenInfo(email, direction);
    }

    // Classe interne pour encapsuler les informations utilisateur
    public static class UserTokenInfo {
        private final String email;
        private final DirectionDto direction;

        public UserTokenInfo(String email, DirectionDto direction) {
            this.email = email;
            this.direction = direction;
        }

        public String getEmail() {
            return email;
        }

        public DirectionDto getDirection() {
            return direction;
        }

        public Long getDirectionNumero() {
            return direction != null ? direction.numero() : null;
        }

        public String getDirectionNom() {
            return direction != null ? direction.nom() : null;
        }
    }
}