package com.proj.course_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service")
public interface UserClient {

    // This method signature MUST match the endpoint in the UserController
    @GetMapping("/api/users/{id}")
    void getUserById(@PathVariable("id") Long id);
}