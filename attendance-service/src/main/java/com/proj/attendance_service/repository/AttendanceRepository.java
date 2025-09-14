package com.proj.attendance_service.repository;

import com.proj.attendance_service.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    // In AttendanceRepository.java
    List<Attendance> findByStudentIdAndCourseId(Long studentId, Long courseId);
}