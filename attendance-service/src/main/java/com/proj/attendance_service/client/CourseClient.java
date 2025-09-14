package com.proj.attendance_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "course-service")
public interface CourseClient {
    // Note: We need to add this endpoint to our CourseController
    @GetMapping("/api/courses/{id}")
    void getCourseById(@PathVariable("id") Long id);
}