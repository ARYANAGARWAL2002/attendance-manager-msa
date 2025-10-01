import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import UserManagement from './pages/UserManagement';
import CourseManagement from './pages/CourseManagement';
import MarkAttendance from './pages/MarkAttendance';
import StudentReport from './pages/StudentReport';
import CourseDetails from './pages/CourseDetails';
import { Users, BookOpen, CheckSquare, FileText, X } from 'lucide-react';

// --- Main App Layout ---
function App() {

    // Helper for styling NavLink
    const getNavLinkClass = ({ isActive }) =>
        `flex items-center px-4 py-3 text-cyan-300 hover:bg-cyan-500/20 hover:text-white transition-all duration-200 rounded-md ${
            isActive ? 'bg-cyan-500/20 text-white border-l-2 border-cyan-400' : 'border-l-2 border-transparent'
        }`;

    const navLinks = [
        { to: "/users", icon: <Users className="w-5 h-5 mr-3" />, text: "User Management" },
        { to: "/courses", icon: <BookOpen className="w-5 h-5 mr-3" />, text: "Course Management" },
        { to: "/mark-attendance", icon: <CheckSquare className="w-5 h-5 mr-3" />, text: "Mark Attendance" },
        { to: "/my-report", icon: <FileText className="w-5 h-5 mr-3" />, text: "Student Portal" }
    ];

    return (
        <Router>
            <div className="flex h-screen bg-black font-paragraph">
                {/* --- Sidebar --- */}
                <aside className="w-64 bg-gray-900/50 border-r border-cyan-400/30 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <h1 className="text-2xl font-heading text-white">Dashboard</h1>
                        <button className="text-cyan-300 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <NavLink key={link.to} to={link.to} className={getNavLinkClass}>
                                {link.icon}
                                <span>{link.text}</span>
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* --- Main Content Area --- */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Routes>
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/courses" element={<CourseManagement />} />
                        <Route path="/courses/:courseId" element={<CourseDetails />} />
                        <Route path="/mark-attendance" element={<MarkAttendance />} />
                        <Route path="/my-report" element={<StudentReport />} />
                        <Route path="/" element={
                            <div className="text-cyan-200">
                                <h2 className="text-3xl font-heading text-cyan-400">Welcome to the Admin Dashboard</h2>
                                <p className="mt-4">Select an option from the sidebar to manage the system.</p>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;

