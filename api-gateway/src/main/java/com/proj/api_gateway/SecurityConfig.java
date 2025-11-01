package com.proj.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                // Disable CSRF (Cross-Site Request Forgery)
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                // Configure authorization rules
                .authorizeExchange(exchanges -> exchanges
                        // Allow all OPTIONS requests (used for CORS preflight)
                        .pathMatchers(HttpMethod.OPTIONS).permitAll()
                        // Allow all other requests
                        .anyExchange().permitAll()
                );

        return http.build();
    }
}