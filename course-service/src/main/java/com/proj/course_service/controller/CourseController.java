package com.proj.course_service.controller;

import com.proj.course_service.client.UserClient;
import com.proj.course_service.dto.UserDto;
import com.proj.course_service.model.Course;
import com.proj.course_service.model.Enrollment;
import com.proj.course_service.repository.CourseRepository;
import com.proj.course_service.repository.EnrollmentRepository;
import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepository;
    private final UserClient userClient;
    private final EnrollmentRepository enrollmentRepository;

    public CourseController(CourseRepository courseRepository, UserClient userClient, EnrollmentRepository enrollmentRepository) {
        this.courseRepository = courseRepository;
        this.userClient = userClient;
        this.enrollmentRepository = enrollmentRepository;
    }

    // --- THIS IS THE UPDATED METHOD ---
    // Note the changes: Pageable parameter and Page<Course> return type
    @GetMapping
    public ResponseEntity<Page<Course>> getAllCourses(Pageable pageable) {
        return ResponseEntity.ok(courseRepository.findAll(pageable));
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
        if (!courseRepository.existsById(courseId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
        }

        try {
            userClient.getUserById(studentId);
        } catch (FeignException.NotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }

        Enrollment newEnrollment = new Enrollment();
        newEnrollment.setCourseId(courseId);
        newEnrollment.setStudentId(studentId);
        enrollmentRepository.save(newEnrollment);

        return ResponseEntity.ok("Student " + studentId + " successfully enrolled in course " + courseId);
    }

    @GetMapping("/{courseId}/enrollments/student/{studentId}")
    public ResponseEntity<Void> isStudentEnrolled(@PathVariable Long courseId, @PathVariable Long studentId) {
        boolean isEnrolled = enrollmentRepository.existsByCourseIdAndStudentId(courseId, studentId);
        if (isEnrolled) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{courseId}/students")
    public ResponseEntity<List<UserDto>> getStudentsInCourse(@PathVariable Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            return ResponseEntity.notFound().build();
        }

        List<Long> studentIds = enrollmentRepository.findByCourseId(courseId)
                .stream()
                .map(Enrollment::getStudentId)
                .collect(Collectors.toList());

        if (studentIds.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<UserDto> students = userClient.getUsersByIds(studentIds);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Course>> getCoursesByStudentId(@PathVariable Long studentId) {
        List<Long> courseIds = enrollmentRepository.findByStudentId(studentId)
                .stream()
                .map(Enrollment::getCourseId)
                .collect(Collectors.toList());

        if (courseIds.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Course> courses = courseRepository.findAllById(courseIds);
        return ResponseEntity.ok(courses);
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        if (!courseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        enrollmentRepository.deleteByCourseId(id);
        courseRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}