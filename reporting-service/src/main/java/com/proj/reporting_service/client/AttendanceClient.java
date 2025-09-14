package com.proj.reporting_service.client;

import com.proj.reporting_service.dto.AttendanceRecordDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@FeignClient(name = "attendance-service")
public interface AttendanceClient {
    // We will add this new endpoint to the Attendance Service
    @GetMapping("/api/attendance/student/{studentId}")
    List<AttendanceRecordDto> getAttendanceForStudent(@PathVariable("studentId") Long studentId, @RequestParam("courseId") Long courseId);
}