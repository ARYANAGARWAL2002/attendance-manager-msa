import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { Calendar, Check } from 'lucide-react';
// 1. Import the DatePicker component and its CSS
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// 2. Import date-fns for formatting the date
import { format } from 'date-fns';

export default function MarkAttendance() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [attendance, setAttendance] = useState({
        studentId: '',
        courseId: '',
        // 3. Store the date as a Date object now, not a string
        date: new Date(), 
        status: 'PRESENT'
    });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [studentsRes, coursesRes] = await Promise.all([
                    apiService.getAllUsers(0, 1000),
                    apiService.getAllCourses(0, 1000)
                ]);
                if (studentsRes.data && Array.isArray(studentsRes.data.content)) {
                    setStudents(studentsRes.data.content);
                }
                if (coursesRes.data && Array.isArray(coursesRes.data.content)) {
                    setCourses(coursesRes.data.content);
                }
            } catch (error) {
                console.error("Failed to load initial data:", error);
                alert("Could not load students and courses.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAttendance({ ...attendance, [name]: value });
    };

    // 4. New handler for the DatePicker component
    const handleDateChange = (date) => {
        setAttendance({ ...attendance, date: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 5. Format the date object into a "YYYY-MM-DD" string for the API
        const submissionData = {
            ...attendance,
            date: format(attendance.date, 'yyyy-MM-dd')
        };
        try {
            await apiService.markAttendance(submissionData);
            alert('Attendance marked successfully!');
            setAttendance({
                ...attendance,
                studentId: '',
                courseId: '',
                status: 'PRESENT'
            });
        } catch (error) {
            console.error("Error marking attendance:", error);
            alert('Failed to mark attendance. Please ensure the student is enrolled in the course.');
        }
    };

    return (
        <>
            {/* 6. Add custom styles for the date picker */}
            <style>{`
                .react-datepicker-wrapper .w-full {
                    width: 100%;
                }
                .react-datepicker {
                    background-color: #0a0a0a !important;
                    border: 1px solid #22d3ee80 !important;
                    font-family: 'Roboto Mono', monospace;
                }
                .react-datepicker__header {
                    background-color: #111 !important;
                    border-bottom: 1px solid #22d3ee80 !important;
                }
                .react-datepicker__current-month,
                .react-datepicker-time__header,
                .react-datepicker-year-header {
                    color: #22d3ee !important;
                }
                .react-datepicker__day-name,
                .react-datepicker__day,
                .react-datepicker__time-name {
                    color: #8be9fd !important;
                }
                .react-datepicker__day:hover {
                    background-color: #22d3ee30 !important;
                }
                .react-datepicker__day--selected,
                .react-datepicker__day--keyboard-selected {
                    background-color: #22d3ee !important;
                    color: #000 !important;
                }
                .react-datepicker__navigation-icon::before {
                    border-color: #22d3ee !important;
                }
            `}</style>
            <div className="min-h-screen bg-black text-cyan-200 font-paragraph p-8">
                <header className="mb-12">
                    <h1 className="text-5xl font-heading text-cyan-400 drop-shadow-cyan-glow">Mark Attendance</h1>
                    <p className="text-lg text-cyan-300 mt-2">Log daily attendance records for students in their enrolled courses.</p>
                </header>

                <main className="max-w-2xl mx-auto">
                    <div className="bg-gray-900/50 border border-cyan-400/30 p-8 rounded-lg shadow-cyan-glow">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {loading ? (
                                <p className="text-center">Loading student and course data...</p>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-paragraph text-cyan-300 mb-2">Select Student</label>
                                        <select name="studentId" value={attendance.studentId} onChange={handleInputChange} required className="w-full h-12 bg-gray-900/50 border border-cyan-400/30 rounded-md px-3 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                            <option value="" disabled>-- Choose a student --</option>
                                            {students.map(student => (
                                                <option key={student.id} value={student.id}>{student.name} (ID: {student.id})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-paragraph text-cyan-300 mb-2">Select Course</label>
                                        <select name="courseId" value={attendance.courseId} onChange={handleInputChange} required className="w-full h-12 bg-gray-900/50 border border-cyan-400/30 rounded-md px-3 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                            <option value="" disabled>-- Choose a course --</option>
                                            {courses.map(course => (
                                                <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-paragraph text-cyan-300 mb-2">Date</label>
                                            {/* 7. Replace the input with the DatePicker component */}
                                            <DatePicker
                                                selected={attendance.date}
                                                onChange={handleDateChange}
                                                dateFormat="yyyy-MM-dd"
                                                className="w-full h-12 bg-gray-900/50 border border-cyan-400/30 rounded-md px-3 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                                wrapperClassName="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-paragraph text-cyan-300 mb-2">Status</label>
                                            <select name="status" value={attendance.status} onChange={handleInputChange} required className="w-full h-12 bg-gray-900/50 border border-cyan-400/30 rounded-md px-3 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                                <option value="PRESENT">Present</option>
                                                <option value="ABSENT">Absent</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-12 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg border border-cyan-400 rounded-md shadow-cyan-glow hover:shadow-cyan-glow-md transition-all duration-300 disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed"
                            >
                                <Check className="w-5 h-5" /> Submit Record
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}
