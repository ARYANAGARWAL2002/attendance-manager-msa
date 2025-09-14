package com.proj.user_service.controller;

import com.proj.user_service.dto.UserDto;
import com.proj.user_service.model.User;
import com.proj.user_service.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Note: For simplicity, service layer is skipped. In a real app, logic should be in a @Service class.

    @PostMapping
    public ResponseEntity<User> createStudent(@RequestBody User user) {
        // Add logic to set role, hash password, etc.
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    UserDto dto = new UserDto();
                    BeanUtils.copyProperties(user, dto); // Copies matching fields
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}