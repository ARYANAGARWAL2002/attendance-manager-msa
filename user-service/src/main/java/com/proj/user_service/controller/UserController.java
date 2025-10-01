package com.proj.user_service.controller;

import com.proj.user_service.dto.UserDto;
import com.proj.user_service.model.User;
import com.proj.user_service.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus; // Add this import

import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping
    public ResponseEntity<Page<UserDto>> getAllUsers(Pageable pageable) {
        Page<User> userPage = userRepository.findAll(pageable);
        Page<UserDto> dtoPage = userPage.map(user -> {
            UserDto dto = new UserDto();
            BeanUtils.copyProperties(user, dto);
            return dto;
        });
        return ResponseEntity.ok(dtoPage);
    }
    @PostMapping("/details")
    public List<UserDto> getUsersByIds(@RequestBody List<Long> userIds) {
        return userRepository.findAllById(userIds).stream()
                .map(user -> {
                    UserDto dto = new UserDto();
                    BeanUtils.copyProperties(user, dto);
                    return dto;
                }).collect(Collectors.toList());
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        // First, check if the user exists
        if (!userRepository.existsById(id)) {
            // If not, return a 404 Not Found
            return ResponseEntity.notFound().build();
        }

        // If the user exists, delete them
        userRepository.deleteById(id);

        // Return a 204 No Content status to indicate success
        return ResponseEntity.noContent().build();
    }
}