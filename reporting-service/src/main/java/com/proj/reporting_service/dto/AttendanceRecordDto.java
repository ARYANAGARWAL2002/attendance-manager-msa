package com.proj.reporting_service.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class AttendanceRecordDto {
    private LocalDate date;
    private String status; // Assuming status is "PRESENT" or "ABSENT"
    // Getters
    public LocalDate getDate() {
        return date;
    }

    public String getStatus() {
        return status;
    }

    // Setters
    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}