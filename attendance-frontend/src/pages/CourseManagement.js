import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { Plus, Users, Trash2, ChevronLeft, ChevronRight, BookOpen, UserCheck } from 'lucide-react';

// --- Reusable UI Components ---

const StatCard = ({ icon, title, value }) => (
    <div className="relative p-8 border border-cyan-400/30 bg-gray-900/50 flex flex-col items-center text-center">
        <span className="font-heading text-6xl text-cyan-400">{value}</span>
        <h3 className="font-paragraph text-cyan-300 mt-2 uppercase tracking-widest">{title}</h3>
    </div>
);

const CreateCourseForm = ({ onCourseCreated, closeDialog }) => {
    const [newCourse, setNewCourse] = useState({ name: '', code: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse({ ...newCourse, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await apiService.createCourse(newCourse);
            onCourseCreated();
            closeDialog();
        } catch (error) {
            console.error("Error creating course:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
            <div>
                <label className="block text-sm font-paragraph text-cyan-300 mb-2">Course Name</label>
                <input name="name" type="text" value={newCourse.name} onChange={handleInputChange} required className="w-full h-10 bg-gray-900/50 border border-cyan-400/30 rounded-md px-3 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
                <label className="block text-sm font-paragraph text-cyan-300 mb-2">Course Code</label>
                <input name="code" type="text" value={newCourse.code} onChange={handleInputChange} required className="w-full h-10 bg-gray-900/50 border border-cyan-400/30 rounded-md px-3 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full h-12 px-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg border border-cyan-400 rounded-md shadow-cyan-glow hover:shadow-cyan-glow-md transition-all">
                {isSubmitting ? 'Creating...' : 'Initiate New Course'}
            </button>
        </form>
    );
};

export default function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [totalCourses, setTotalCourses] = useState(0);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState('');
    
    const navigate = useNavigate();

    const loadData = async () => {
        setLoading(true);
        try {
            const [coursesRes, studentsRes] = await Promise.all([
                apiService.getAllCourses(page, rowsPerPage),
                apiService.getAllUsers(0, 1000)
            ]);

            if (coursesRes.data && Array.isArray(coursesRes.data.content)) {
                setCourses(coursesRes.data.content);
                setTotalCourses(coursesRes.data.totalElements);
            }
            if (studentsRes.data && Array.isArray(studentsRes.data.content)) {
                setStudents(studentsRes.data.content);
            }
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [page, rowsPerPage]);

    const handleCourseCreated = () => { loadData(); };

    const handleDeleteCourse = async (e, courseId) => {
        e.stopPropagation(); 
        try {
            await apiService.deleteCourse(courseId);
            loadData();
            alert('Course deleted successfully!');
        } catch (error) {
            console.error("Failed to delete course:", error);
            alert('Failed to delete course.');
        }
    };

    const handleEnrollClick = (e, course) => {
        e.stopPropagation();
        setSelectedCourse(course);
        setIsEnrollDialogOpen(true);
    };
    
    const handleEnrollStudent = async () => {
        if (!selectedStudent || !selectedCourse) return;
        try {
            await apiService.enrollStudent(selectedCourse.id, selectedStudent);
            alert(`Student successfully enrolled in ${selectedCourse.name}`);
            setIsEnrollDialogOpen(false);
            setSelectedCourse(null);
            setSelectedStudent('');
        } catch (error) {
            console.error("Failed to enroll student:", error);
            alert("Failed to enroll student. Check IDs.");
        }
    };

    const totalPages = Math.ceil(totalCourses / rowsPerPage);

    return (
        <div className="min-h-screen bg-black text-cyan-200 font-paragraph p-8">
            <header className="text-center mb-16">
                <p className="font-paragraph text-cyan-400 uppercase tracking-widest mb-4"></p>
                <h1 className="text-6xl md:text-8xl font-heading font-black text-white" style={{textShadow: '2px 2px 0px rgba(34, 211, 238, 0.5), -2px -2px 0px rgba(255, 0, 255, 0.3)'}}>
                    Course Management <span className="text-cyan-400">System</span>
                </h1>
            </header>
            
            <section className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <StatCard icon={<BookOpen className="w-10 h-10 text-cyan-400"/>} title="Active Courses" value={totalCourses} />
                    <StatCard icon={<Users className="w-10 h-10 text-cyan-400"/>} title="Total Students" value={students.length} />
                    <StatCard icon={<UserCheck className="w-10 h-10 text-cyan-400"/>} title="Unique Instructors" value={"N/A"} />
                </div>
                
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-heading text-white">Course Data Grid</h2>
                    <button onClick={() => setIsCreateDialogOpen(true)} className="px-6 py-3 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold border border-cyan-400 rounded-md shadow-cyan-glow hover:shadow-cyan-glow-md transition-all">
                        <Plus className="w-5 h-5"/> Initiate New Course
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(course => (
                        <div 
                            key={course.id} 
                            className="bg-gray-900/50 border-2 border-gray-800 hover:border-cyan-400/50 transition-all duration-300 p-6 rounded-lg cursor-pointer"
                            onClick={() => navigate(`/courses/${course.id}`)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-heading text-xl text-white">{course.name}</h3>
                                <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full">{course.code}</span>
                            </div>
                            <div className="flex justify-between items-center mt-6">
                                <button onClick={(e) => handleEnrollClick(e, course)} className="px-4 py-2 text-sm flex items-center gap-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black rounded-md transition-all">
                                    <Users className="w-4 h-4"/> Enroll
                                </button>
                                <button onClick={(e) => handleDeleteCourse(e, course.id)} className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
                                    <Trash2 className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-12">
                        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-md hover:bg-cyan-500/20 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
                        <span className="font-paragraph">Page {page + 1} of {totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="p-2 rounded-md hover:bg-cyan-500/20 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                )}
            </section>

            {isCreateDialogOpen && (
                <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center">
                    <div className="bg-gray-900 border border-cyan-400/50 p-8 rounded-lg shadow-cyan-glow-md relative w-full max-w-md">
                        <h2 className="text-2xl font-heading text-white mb-6">Initiate New Course</h2>
                        <CreateCourseForm onCourseCreated={handleCourseCreated} closeDialog={() => setIsCreateDialogOpen(false)} />
                        <button onClick={() => setIsCreateDialogOpen(false)} className="absolute top-4 right-4 text-cyan-300 hover:text-white text-2xl">&times;</button>
                    </div>
                </div>
            )}
            
            {isEnrollDialogOpen && selectedCourse && (
                <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center">
                    <div className="bg-gray-900 border border-cyan-400/50 p-8 rounded-lg shadow-cyan-glow-md relative w-full max-w-md">
                        <h2 className="text-2xl font-heading text-white mb-4">Enroll Student in <span className="text-cyan-400">{selectedCourse.name}</span></h2>
                        <div className="space-y-4">
                            <label className="block text-sm font-paragraph text-cyan-300">Select Student</label>
                            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full h-10 bg-gray-900/50 border border-cyan-400/30 rounded-md px-3 text-cyan-200">
                                <option value="" disabled>-- Choose a student --</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.id}>{student.name} ({student.email})</option>
                                ))}
                            </select>
                            <button onClick={handleEnrollStudent} disabled={!selectedStudent} className="w-full h-12 px-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg border border-cyan-400 rounded-md shadow-cyan-glow hover:shadow-cyan-glow-md transition-all">
                                Confirm Enrollment
                            </button>
                        </div>
                        <button onClick={() => setIsEnrollDialogOpen(false)} className="absolute top-4 right-4 text-cyan-300 hover:text-white text-2xl">&times;</button>
                    </div>
                </div>
            )}
        </div>
    );
}

