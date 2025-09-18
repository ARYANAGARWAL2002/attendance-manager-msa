package com.proj.course_service.repository;

import com.proj.course_service.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(Long studentId);
    void deleteByCourseId(Long courseId);
}