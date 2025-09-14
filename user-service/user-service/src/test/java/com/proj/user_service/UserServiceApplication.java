package com.proj.user_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient // This is for registering with Eureka
public class UserServiceApplication {

    public static void main(String[] args) {
        // This method starts your actual microservice
        SpringApplication.run(UserServiceApplication.class, args);
    }
}