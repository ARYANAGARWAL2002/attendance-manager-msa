import axios from 'axios';

const API_BASE_URL = 'http://localhost:8888'; // Your API Gateway URL

const apiService = {
    // --- User Service ---
    getAllUsers: (page = 0, size = 5) => axios.get(`${API_BASE_URL}/api/users?page=${page}&size=${size}`),
    createUser: (user) => axios.post(`${API_BASE_URL}/api/users`, user),
    deleteUser: (id) => axios.delete(`${API_BASE_URL}/api/users/${id}`),

    // --- Course Service ---
   getAllCourses: (page = 0, size = 5) => axios.get(`${API_BASE_URL}/api/courses?page=${page}&size=${size}`),
    createCourse: (course) => axios.post(`${API_BASE_URL}/api/courses`, course),
    enrollStudent: (courseId, studentId) => axios.post(`${API_BASE_URL}/api/courses/${courseId}/enroll/student/${studentId}`),
    deleteCourse: (id) => axios.delete(`${API_BASE_URL}/api/courses/${id}`),
    // ADD THESE TWO NEW FUNCTIONS
    getCourseById: (id) => axios.get(`${API_BASE_URL}/api/courses/${id}`),
    getStudentsInCourse: (id) => axios.get(`${API_BASE_URL}/api/courses/${id}/students`),


    // --- Attendance Service ---
    markAttendance: (attendanceRecord) => axios.post(`${API_BASE_URL}/api/attendance/mark`, attendanceRecord),

    // --- Reporting Service ---
    getStudentReport: (studentId) => axios.get(`${API_BASE_URL}/api/reports/student/${studentId}`)
};

export default apiService;