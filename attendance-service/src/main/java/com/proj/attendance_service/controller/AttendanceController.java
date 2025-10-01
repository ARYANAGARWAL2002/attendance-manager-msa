package com.proj.attendance_service.controller;

import com.proj.attendance_service.client.CourseClient;
import com.proj.attendance_service.client.UserClient;
import com.proj.attendance_service.model.Attendance;
import com.proj.attendance_service.repository.AttendanceRepository;
import feign.FeignException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepository;
    private final UserClient userClient;
    private final CourseClient courseClient;

    public AttendanceController(AttendanceRepository attendanceRepository, UserClient userClient, CourseClient courseClient) {
        this.attendanceRepository = attendanceRepository;
        this.userClient = userClient;
        this.courseClient = courseClient;
    }

    @GetMapping("/student/{studentId}")
    public List<Attendance> getAttendanceForStudent(@PathVariable Long studentId, @RequestParam Long courseId) {
        return attendanceRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    @PostMapping("/mark")
    public ResponseEntity<String> markAttendance(@RequestBody Attendance attendance) {
        // 1. Validate student exists by calling User Service
        try {
            userClient.getUserById(attendance.getStudentId());
        } catch (FeignException.NotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student with ID " + attendance.getStudentId() + " not found.");
        }

        // 2. Validate course exists by calling Course Service
        try {
            courseClient.getCourseById(attendance.getCourseId());
        } catch (FeignException.NotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course with ID " + attendance.getCourseId() + " not found.");
        }

        // --- THIS IS THE NEW VALIDATION BLOCK ---
        // 3. Validate that the student is enrolled in the course by calling Course Service
        try {
            courseClient.isStudentEnrolled(attendance.getCourseId(), attendance.getStudentId());
        } catch (FeignException.NotFound e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Student is not enrolled in this course.");
        }
        // ------------------------------------

        // 4. If all validations pass, save the attendance record
        attendanceRepository.save(attendance);
        return ResponseEntity.status(HttpStatus.CREATED).body("Attendance marked successfully.");
    }
}