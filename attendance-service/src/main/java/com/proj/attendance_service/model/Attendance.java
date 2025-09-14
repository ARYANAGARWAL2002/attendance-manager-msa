package com.proj.attendance_service.model;

import jakarta.persistence.*;
import lombok.Data; // <-- Make sure this import is here
import lombok.Getter;

import java.time.LocalDate;

@Entity
@Table(name = "attendance_records")
@Data // <-- And this annotation is here
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId; // <-- And this field is spelled correctly

    private Long courseId;
    private LocalDate date;
    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;
    public Long getStudentId() {
        return this.studentId;
    }
    public Long getCourseId() { // <-- Add this method
        return this.courseId;
    }
}