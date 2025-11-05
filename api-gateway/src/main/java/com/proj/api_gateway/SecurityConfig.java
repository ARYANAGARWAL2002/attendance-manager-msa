package com.proj.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

// --- ADD THESE IMPORTS ---
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
// --- END OF NEW IMPORTS ---

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    // This is your existing bean, which is correct.
    // The .cors(cors -> {}) tells Spring Security to find the bean below.
    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .cors(cors -> {
                })
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        .anyExchange().permitAll());

        return http.build();
    }

    // --- ADD THIS NEW BEAN TO CONFIGURE CORS ---
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // This is your public frontend URL
        corsConfig.setAllowedOrigins(Arrays.asList("http://a8c6d77538f6247058a6587977e1e5fe-2106839559.eu-north-1.elb.amazonaws.com:3000"));

        corsConfig.setMaxAge(3600L);
        corsConfig.addAllowedMethod("*"); // Allow all methods
        corsConfig.addAllowedHeader("*"); // Allow all headers
        corsConfig.setAllowCredentials(true); // Allow cookies/auth headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig); // Apply to all paths

        return new CorsWebFilter(source);
    }
}