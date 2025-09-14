package com.proj.attendance_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients // <-- Add this
public class AttendanceServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(AttendanceServiceApplication.class, args);
	}
}