package com.proj.reporting_service.client;

import com.proj.reporting_service.dto.CourseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "course-service")
public interface CourseClient {
    // We will add this new endpoint to the Course Service
    @GetMapping("/api/courses/student/{studentId}")
    List<CourseDto> getCoursesByStudentId(@PathVariable("studentId") Long studentId);
}