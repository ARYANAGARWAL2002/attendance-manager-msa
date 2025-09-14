package com.proj.reporting_service.dto;

import lombok.Data;
@Data
public class CourseDto {
    private Long id;
    private String name;
    private String code;
    // --- Manually add getters and setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}