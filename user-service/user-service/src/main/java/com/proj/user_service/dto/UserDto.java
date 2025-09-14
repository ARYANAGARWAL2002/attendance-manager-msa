package com.proj.user_service.dto;

import com.proj.user_service.model.Role;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
}
