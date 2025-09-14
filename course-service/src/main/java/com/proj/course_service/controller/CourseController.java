package com.proj.course_service.controller;

import com.proj.course_service.client.UserClient;
import com.proj.course_service.model.Course;
import com.proj.course_service.model.Enrollment; // New import
import com.proj.course_service.repository.CourseRepository;
import com.proj.course_service.repository.EnrollmentRepository; // New import
import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors; // New import

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepository;
    private final UserClient userClient;
    private final EnrollmentRepository enrollmentRepository; // CHANGE: Added repository for enrollments

    // CHANGE: Updated constructor to include the new repository
    public CourseController(CourseRepository courseRepository, UserClient userClient, EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.userClient = userClient;
        this.enrollmentRepository = enrollmentRepository;
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{courseId}/enroll/student/{studentId}")
    public ResponseEntity<String> enrollStudent(@PathVariable Long courseId, @PathVariable Long studentId) {
        // 1. Check if the course exists
        if (!courseRepository.existsById(courseId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
        }

        // 2. Call User-Service to check if the student exists
        try {
            userClient.getUserById(studentId);
        } catch (FeignException.NotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }

        // CHANGE: Create and save the enrollment record
        Enrollment newEnrollment = new Enrollment();
        newEnrollment.setCourseId(courseId);
        newEnrollment.setStudentId(studentId);
        enrollmentRepository.save(newEnrollment);

        return ResponseEntity.ok("Student " + studentId + " successfully enrolled in course " + courseId);
    }

    // CHANGE: Added the new endpoint required by the reporting-service
    @GetMapping("/student/{studentId}")
    public List<Course> getCoursesByStudentId(@PathVariable Long studentId) {
        // Find all course IDs for the given student from the enrollment table
        List<Long> courseIds = enrollmentRepository.findByStudentId(studentId)
                .stream()
                .map(Enrollment::getCourseId)
                .collect(Collectors.toList());

        // Return all course details for the found course IDs
        return courseRepository.findAllById(courseIds);
    }
}