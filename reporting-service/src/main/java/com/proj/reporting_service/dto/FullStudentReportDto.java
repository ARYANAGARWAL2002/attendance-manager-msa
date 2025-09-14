package com.proj.reporting_service.dto;

import lombok.Data;
import java.util.List;
@Data
public class FullStudentReportDto {
    private Long studentId;
    private String studentName;
    private List<CourseReport> courseReports;

    // Getters
    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public List<CourseReport> getCourseReports() {
        return courseReports;
    }

    // Setters
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setCourseReports(List<CourseReport> courseReports) {
        this.courseReports = courseReports;
    }
}