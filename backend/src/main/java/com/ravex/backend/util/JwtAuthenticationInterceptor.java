package com.ravex.backend.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ravex.backend.dto.ApiResponse;
import com.ravex.backend.dto.DirectionDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtAuthenticationInterceptor implements HandlerInterceptor {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final JwtUtil jwtUtil;

    // Injection du bean JwtUtil
    public JwtAuthenticationInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        // Permettre les requêtes OPTIONS (CORS preflight)
        if ("OPTIONS".equals(request.getMethod())) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendUnauthorizedResponse(response, "Token d'authentification manquant");
            return false;
        }

        String token = authHeader.substring(7);

        try {
            // Récupérer toutes les informations utilisateur du token
            JwtUtil.UserTokenInfo userInfo = jwtUtil.getUserInfoFromToken(token);

            if (userInfo.getEmail() == null || userInfo.getEmail().isEmpty()) {
                sendUnauthorizedResponse(response, "Token invalide");
                return false;
            }

            // Ajouter les informations utilisateur dans les attributs de la requête
            request.setAttribute("userEmail", userInfo.getEmail());
            request.setAttribute("userDirection", userInfo.getDirection());
            request.setAttribute("directionNumero", userInfo.getDirectionNumero());
            request.setAttribute("directionNom", userInfo.getDirectionNom());

            return true;

        } catch (Exception e) {
            sendUnauthorizedResponse(response, "Token invalide ou expiré");
            return false;
        }
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ApiResponse apiResponse = new ApiResponse(message);
        String jsonResponse = objectMapper.writeValueAsString(apiResponse);

        response.getWriter().write(jsonResponse);
    }
}