import React, { useState } from 'react';
import apiService from '../services/apiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// --- Reusable Icon Components (using inline SVG) ---
const UserIcon = ({ className = "w-5 h-5 text-cyan-400" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const BookOpenIcon = ({ className = "w-6 h-6 text-cyan-400" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const TrendingUpIcon = ({ className = "w-6 h-6 text-cyan-400" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const CalendarIcon = ({ className = "w-6 h-6 text-cyan-400" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const PlaceholderIcon = ({ className = "w-16 h-16 text-cyan-400 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;


// --- Helper Functions ---
const getAttendanceColor = (percentage) => {
  if (percentage >= 85) return '#22c55e'; // Green
  if (percentage >= 75) return '#eab308'; // Yellow
  if (percentage >= 65) return '#f97316'; // Orange
  return '#ef4444'; // Red
};

const getPieChartData = (attended, total) => [
  { name: 'Attended', value: attended, color: '#22c55e' },
  { name: 'Missed', value: total - attended, color: '#ef4444' }
];

export default function StudentReport() {
  const [studentId, setStudentId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleFetchReport = async (e) => {
    e.preventDefault();
    if (!studentId.trim()) {
      setError('Please enter a valid Student ID');
      return;
    }
    setLoading(true);
    setError('');
    setReport(null);

    try {
      const response = await apiService.getStudentReport(studentId);
      if (!response.data || !response.data.courseReports || response.data.courseReports.length === 0) {
        setError('No attendance records found for this Student ID');
      } else {
        setReport(response.data);
      }
    } catch (err) {
      setError('Failed to fetch attendance data. Please check the Student ID.');
      console.error('Error fetching attendance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallStats = () => {
    if (!report || !report.courseReports || report.courseReports.length === 0) {
      return { totalCourses: 0, avgAttendance: 0, totalClasses: 0, totalAttended: 0 };
    }
    const totalCourses = report.courseReports.length;
    const totalClasses = report.courseReports.reduce((sum, course) => sum + course.totalClasses, 0);
    const totalAttended = report.courseReports.reduce((sum, course) => sum + course.attendedClasses, 0);
    const avgAttendance = totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
    return { totalCourses, avgAttendance, totalClasses, totalAttended };
  };
  
  const stats = calculateOverallStats();

  return (
    <div className="min-h-screen bg-black text-cyan-200 font-paragraph flex flex-col">
      {/* Header */}
      <header className="w-full bg-black border-b border-cyan-400/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-cyan-400 uppercase tracking-tight drop-shadow-cyan-glow">
              STUDENT PORTAL
            </h1>
            <p className="text-lg mt-2">
              Attendance Management System
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <section className="w-full bg-gradient-to-br from-black via-gray-900 to-black py-16 md:py-24 border-b border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Search and Info */}
            <div>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-cyan-400 uppercase tracking-tight mb-6 drop-shadow-cyan-glow">
                VIEW YOUR<br />ATTENDANCE REPORT
              </h2>
              <p className="text-lg mb-8 max-w-lg">
                Enter your Student ID to access detailed attendance reports for all your enrolled courses.
              </p>
              <form onSubmit={handleFetchReport} className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="h-12 text-lg w-full flex-1 bg-gray-900/50 border border-cyan-400/30 rounded-md px-4 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !studentId.trim()}
                  className="h-12 px-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg border border-cyan-400 rounded-md shadow-cyan-glow hover:shadow-cyan-glow-md transition-all duration-300 disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Get Report'}
                </button>
              </form>
              {error && <p className="text-red-400 font-paragraph text-sm mt-4">{error}</p>}
            </div>
            
            {/* Right Column: Report Display Area */}
            <div className="hidden lg:block relative min-h-[20rem] bg-black border border-cyan-400/30 rounded-lg shadow-[inset_0_0_20px_rgba(34,211,238,0.1)] p-6">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center animate-pulse">
                    <p className="text-cyan-300">Fetching report...</p>
                  </div>
                </div>
              ) : report ? (
                // Display the new summary view if data exists
                <div className="flex flex-col h-full">
                  <h3 className="font-heading text-xl text-cyan-400 uppercase tracking-tight mb-4 text-center">Overall Summary for {report.studentName}</h3>
                  <div className="flex-grow h-48">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={getPieChartData(stats.totalAttended, stats.totalClasses)} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {getPieChartData(stats.totalAttended, stats.totalClasses).map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #22d3ee' }}/>
                        </PieChart>
                      </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                      <div><p className="font-paragraph text-sm text-cyan-300">Total Courses</p><p className="font-heading text-2xl text-cyan-400">{stats.totalCourses}</p></div>
                      <div><p className="font-paragraph text-sm text-cyan-300">Avg. Attendance</p><p className="font-heading text-2xl" style={{ color: getAttendanceColor(stats.avgAttendance) }}>{stats.avgAttendance.toFixed(1)}%</p></div>
                      <div><p className="font-paragraph text-sm text-cyan-300">Total Classes</p><p className="font-heading text-2xl text-cyan-400">{stats.totalClasses}</p></div>
                  </div>
                </div>
              ) : (
                // Display the placeholder if no report is loaded
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <PlaceholderIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    <p className="text-cyan-300 mt-2">Your attendance data will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Course Breakdown Section */}
      {report && (
        <section className="w-full py-16 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <h3 className="font-heading text-3xl md:text-4xl text-cyan-400 uppercase tracking-tight mb-4 drop-shadow-cyan-glow">
                Detailed Course Breakdown
              </h3>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {report.courseReports.map((course, index) => (
                <div key={index} className="bg-gray-900/50 border border-cyan-400/30 shadow-cyan-glow p-6 rounded-lg">
                  <h4 className="font-heading text-xl text-cyan-400 uppercase tracking-tight">{course.courseName}</h4>
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center"><span className="font-paragraph text-cyan-300">Attendance Rate</span><span className="font-heading text-lg" style={{ color: getAttendanceColor(course.attendancePercentage) }}>{course.attendancePercentage.toFixed(1)}%</span></div>
                      <div className="flex justify-between items-center"><span className="font-paragraph text-cyan-300">Classes Attended</span><span className="font-paragraph text-cyan-100">{course.attendedClasses} / {course.totalClasses}</span></div>
                    </div>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={getPieChartData(course.attendedClasses, course.totalClasses)} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value">
                            {getPieChartData(course.attendedClasses, course.totalClasses).map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #22d3ee', borderRadius: '8px' }}/>
                          <Legend wrapperStyle={{ fontSize: '12px' }}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full bg-black border-t border-cyan-400/30 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm text-cyan-500">© 2024 Student Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

