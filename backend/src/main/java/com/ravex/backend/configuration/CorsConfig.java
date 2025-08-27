package com.ravex.backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Autorise toutes les origines (tous les PC du réseau local)
                registry.addMapping("/**")
                        .allowedOrigins("*") // ⚠️ uniquement pour dev/test
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }
}







// package com.ravex.backend.configuration;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class CorsConfig {
//     @Bean
//     public WebMvcConfigurer corsConfigurer() {
//         return new WebMvcConfigurer() {
//             @Override
//             public void addCorsMappings(CorsRegistry registry) {
//                 registry.addMapping("/**").allowedOrigins("http://127.0.0.1:5173", "http://localhost:5173") // ton frontend
//                         .allowedMethods("GET", "POST", "PUT", "DELETE")
//                         .allowedOrigins("*"); // ⚠️ seulement pour dev/test, pas en prod

//             }
//         };
//     }
// }
