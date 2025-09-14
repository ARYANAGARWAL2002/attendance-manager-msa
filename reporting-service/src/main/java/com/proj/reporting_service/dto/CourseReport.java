package com.proj.reporting_service.dto;

import lombok.Data;
@Data
public class CourseReport {
    private String courseName;
    private double attendancePercentage;
    private long totalClasses;
    private long attendedClasses;
    // Getters
    public String getCourseName() {
        return courseName;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public long getTotalClasses() {
        return totalClasses;
    }

    public long getAttendedClasses() {
        return attendedClasses;
    }

    // Setters
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public void setTotalClasses(long totalClasses) {
        this.totalClasses = totalClasses;
    }

    public void setAttendedClasses(long attendedClasses) {
        this.attendedClasses = attendedClasses;
    }
}