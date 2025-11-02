import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { Plus, Trash2, Users, Search, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';

// --- Reusable UI Components ---

// A simple card component for the stats at the top
const StatCard = ({ icon, title, value }) => (
  <div className="bg-gray-900/50 border border-cyan-400/30 p-6 rounded-lg flex items-center gap-4 shadow-cyan-glow">
    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-400/30">
      {icon}
    </div>
    <div>
      <p className="font-paragraph text-sm text-cyan-300">{title}</p>
      <p className="font-heading text-3xl text-white">{value}</p>
    </div>
  </div>
);

// The form for creating a new user, which will appear in a dialog
const CreateUserForm = ({ onUserCreated, closeDialog }) => {
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'ROLE_STUDENT' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiService.createUser(newUser);
      onUserCreated(); // This will refresh the user list and show a snackbar
      closeDialog(); // Close the dialog on success
    } catch (error) {
      console.error("Error creating user:", error);
      // You could add an error snackbar here as well
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div>
        <label className="block text-sm font-paragraph text-cyan-300 mb-2">Name</label>
        <input name="name" type="text" value={newUser.name} onChange={handleInputChange} required className="w-full h-10 bg-gray-900/50 border border-cyan-400/30 rounded-md px-3 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
      </div>
      <div>
        <label className="block text-sm font-paragraph text-cyan-300 mb-2">Email</label>
        <input name="email" type="email" value={newUser.email} onChange={handleInputChange} required className="w-full h-10 bg-gray-900/50 border border-cyan-400/30 rounded-md px-3 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
      </div>
      <div>
        <label className="block text-sm font-paragraph text-cyan-300 mb-2">Password</label>
        <input name="password" type="password" value={newUser.password} onChange={handleInputChange} required className="w-full h-10 bg-gray-900/50 border border-cyan-400/30 rounded-md px-3 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full h-12 px-8 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg border border-cyan-400 rounded-md shadow-cyan-glow hover:shadow-cyan-glow-md transition-all duration-300">
        {isSubmitting ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};


export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);

  // State for the create user dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllUsers(page, rowsPerPage);
      if (response.data && Array.isArray(response.data.content)) {
        setUsers(response.data.content);
        setTotalUsers(response.data.totalElements);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage]);

  const handleDeleteUser = async (userId) => {
    try {
      await apiService.deleteUser(userId);
      loadUsers(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleUserCreated = () => {
    loadUsers(); 
  };
  
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(totalUsers / rowsPerPage);

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'bg-red-500/20 text-red-400 border border-red-500/50';
      case 'ROLE_FACULTY': return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-200 font-paragraph p-8">
      <header className="mb-12">
        {/* --- CHANGE 2: Updated header style --- */}
        <h1 className="text-5xl font-heading text-cyan-400 drop-shadow-cyan-glow">User Management System</h1>
        <p className="text-lg text-cyan-300 mt-2">A high-performance dashboard for real-time user administration.</p>
      </header>

      {/* --- CHANGE 1: Simplified Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard icon={<Users className="w-6 h-6 text-cyan-400" />} title="Total Users" value={totalUsers} />
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Command Center */}
        <aside className="lg:col-span-3 space-y-6">
            <div className="bg-gray-900/50 border border-cyan-400/30 p-6 rounded-lg shadow-cyan-glow">
                <h2 className="text-2xl font-heading text-white mb-4">Command Center</h2>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-10 bg-gray-900/50 border border-cyan-400/30 rounded-md text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                </div>
                <button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg border border-cyan-400 rounded-md shadow-cyan-glow hover:shadow-cyan-glow-md transition-all duration-300"
                >
                  <Plus className="w-5 h-5" /> Create User
                </button>
            </div>
        </aside>

        {/* Right Column: User List */}
        <main className="lg:col-span-9">
            <div className="space-y-4">
                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    filteredUsers.map(user => (
                        <div key={user.id} className="bg-gray-900/50 border border-cyan-400/30 p-4 rounded-lg flex items-center justify-between gap-4 hover:border-cyan-400/80 transition-all">
                            <div className="flex items-center gap-4">
                                <div>
                                                                    <h3 className="font-heading text-white font-semibold">{user.name}</h3>
                                                                    <p className="text-sm text-cyan-300">{user.email}</p>
                                                                    <p className="text-xs text-gray-400 mt-1">ID: {user.id}</p>
                                                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${getRoleBadgeClass(user.role)}`}>
                                    {user.role.replace('ROLE_', '')}
                                </span>
                                <button onClick={() => handleDeleteUser(user.id)} className="text-red-500/70 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-full transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8">
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-md hover:bg-cyan-500/20 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="font-paragraph">Page {page + 1} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="p-2 rounded-md hover:bg-cyan-500/20 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
                </div>
            )}
        </main>
      </div>

      {/* Create User Dialog */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center">
            <div className="bg-gray-900 border border-cyan-400/50 p-8 rounded-lg shadow-cyan-glow-md relative w-full max-w-md">
                <h2 className="text-2xl font-heading text-white mb-6">Create New User</h2>
                <CreateUserForm onUserCreated={handleUserCreated} closeDialog={() => setIsCreateDialogOpen(false)} />
                <button onClick={() => setIsCreateDialogOpen(false)} className="absolute top-4 right-4 text-cyan-300 hover:text-white">&times;</button>
            </div>
        </div>
      )}
    </div>
  );
}

