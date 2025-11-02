package com.proj.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// We no longer need HttpMethod
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                // ADD THIS LINE: This tells Spring Security to use the
                // CORS configuration bean provided by Spring Cloud Gateway
                // (which is loaded from your api-gateway.properties file)
                .cors(cors -> {
                })

                // Disable CSRF (Cross-Site Request Forgery)
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                // Configure authorization rules
                .authorizeExchange(exchanges -> exchanges
                        // We no longer need to permit OPTIONS manually,
                        // the .cors() handler above will take care of it.
                        .anyExchange().permitAll());

        return http.build();
    }
}