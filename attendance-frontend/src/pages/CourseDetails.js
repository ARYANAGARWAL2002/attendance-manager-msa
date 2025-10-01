import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../services/apiService';
import { ChevronLeft, Users, BookOpen } from 'lucide-react';

export default function CourseDetails() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const [courseRes, studentsRes] = await Promise.all([
                    apiService.getCourseById(courseId),
                    apiService.getStudentsInCourse(courseId)
                ]);
                setCourse(courseRes.data);
                setStudents(studentsRes.data);
            } catch (err) {
                setError('Failed to fetch course details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [courseId]);

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400"><p>Loading Details...</p></div>;
    }

    if (error) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-red-400"><p>{error}</p></div>;
    }

    return (
        <div className="min-h-screen bg-black text-cyan-200 font-paragraph p-8">
            <header className="max-w-7xl mx-auto mb-12">
                <Link to="/courses" className="flex items-center gap-2 text-cyan-400 hover:text-white transition-colors mb-4">
                    <ChevronLeft className="w-5 h-5" />
                    Back to Course Grid
                </Link>
                <div className="bg-gray-900/50 border border-cyan-400/30 p-6 rounded-lg">
                    <h1 className="text-4xl font-heading text-white">{course?.name}</h1>
                    <p className="text-lg text-cyan-300 mt-2">Course Code: {course?.code}</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-heading text-white mb-6 flex items-center gap-3">
                    <Users className="w-8 h-8 text-cyan-400" />
                    Enrolled Students ({students.length})
                </h2>
                <div className="bg-gray-900/50 border border-cyan-400/30 rounded-lg">
                    {students.length > 0 ? (
                        <ul className="divide-y divide-cyan-400/20">
                            {students.map(student => (
                                <li key={student.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-white">{student.name}</p>
                                        <p className="text-sm text-cyan-300">{student.email}</p>
                                    </div>
                                    <span className="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-1 rounded">ID: {student.id}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center p-12">
                            <BookOpen className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
                            <p className="text-cyan-300">No students are enrolled in this course yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
