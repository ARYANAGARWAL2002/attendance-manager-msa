package com.proj.reporting_service.controller;

import com.proj.reporting_service.client.*;
import com.proj.reporting_service.dto.*;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportingController {

    private final UserClient userClient;
    private final CourseClient courseClient;
    private final AttendanceClient attendanceClient;

    public ReportingController(UserClient userClient, CourseClient courseClient, AttendanceClient attendanceClient) {
        this.userClient = userClient;
        this.courseClient = courseClient;
        this.attendanceClient = attendanceClient;
    }

    @GetMapping("/student/{studentId}")
    public FullStudentReportDto getStudentReport(@PathVariable Long studentId) {
        // 1. Get Student Details
        UserDto user = userClient.getUserById(studentId);

        // 2. Get Courses for the student
        List<CourseDto> courses = courseClient.getCoursesByStudentId(studentId);

        List<CourseReport> courseReports = new ArrayList<>();

        // 3. For each course, get attendance and calculate percentage
        for (CourseDto course : courses) {
            List<AttendanceRecordDto> records = attendanceClient.getAttendanceForStudent(studentId, course.getId());

            long totalClasses = records.size();
            long attendedClasses = records.stream().filter(r -> "PRESENT".equalsIgnoreCase(r.getStatus())).count();
            double percentage = (totalClasses == 0) ? 0 : ((double) attendedClasses / totalClasses) * 100;

            CourseReport courseReport = new CourseReport();
            courseReport.setCourseName(course.getName());
            courseReport.setTotalClasses(totalClasses);
            courseReport.setAttendedClasses(attendedClasses);
            courseReport.setAttendancePercentage(percentage);
            courseReports.add(courseReport);
        }

        // 4. Assemble the final report
        FullStudentReportDto finalReport = new FullStudentReportDto();
        finalReport.setStudentId(user.getId());
        finalReport.setStudentName(user.getName());
        finalReport.setCourseReports(courseReports);

        return finalReport;
    }
}