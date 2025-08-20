package com.ravex.backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Désactive la protection CSRF pour toutes les requêtes
            .authorizeHttpRequests(authorize -> authorize
                // Autorise toutes les requêtes (GET, POST, etc.) vers l'URL /agents
                .requestMatchers(HttpMethod.GET, "/agents").permitAll()
                .requestMatchers(HttpMethod.POST, "/agents").permitAll()
                .requestMatchers(HttpMethod.PUT, "/agents").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults()); // Active l'authentification de base

        return http.build();
    }
}