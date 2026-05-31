package com.fatec.fleetsync.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Libera todas as rotas da API
                .allowedOrigins("http://localhost:5173") // O endereço exato do seu React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD") // Libera os verbos HTTP
                .allowedHeaders("*") // Libera envio de tokens e JSON
                .allowCredentials(true); // Permite gerenciar sessões
    }
}