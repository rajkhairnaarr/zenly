import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserIcon, ChartBarIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMoods: 0,
    totalJournals: 0,
    totalMeditations: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [meditations, setMeditations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 5,
    audioUrl: '',
    category: 'guided',
    type: 'guided',
    isPremium: false
  });
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchData();
    fetchMeditations();
  }, []);

  const fetchData = async () => {
    try {
      // Try to fetch users
      const backendPort = localStorage.getItem('backendPort') || '5001';
      const res = await axios.get(`http://localhost:${backendPort}/admin/users`);
      setUsers(res.data);
      
      // Mock stats data for demonstration
      setStats({
        totalUsers: res.data.length || 3,
        totalMoods: 27,
        totalJournals: 12,
        totalMeditations: 45
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      // Mock data for development
      setUsers([
        { _id: '1', name: 'Admin User', email: 'admin@zenly.com', role: 'admin', createdAt: new Date().toISOString() },
        { _id: '2', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: new Date().toISOString() },
        { _id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: new Date().toISOString() }
      ]);
      
      setStats({
        totalUsers: 3,
        totalMoods: 27,
        totalJournals: 12,
        totalMeditations: 45
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMeditations = async () => {
    try {
      setLoading(true);
      const backendPort = localStorage.getItem('backendPort') || '5001';
      const res = await axios.get(`http://localhost:${backendPort}/api/meditations`);
      setMeditations(res.data);
    } catch (err) {
      console.error('Error fetching meditations:', err);
      // Example meditations for demo purposes
      setMeditations([
        {
          _id: '1',
          title: 'Breathing Meditation',
          description: 'Focus on your breath to calm your mind and body.',
          duration: 5,
          audioUrl: 'https://example.com/audio/breathing.mp3',
          category: 'breathing',
          type: 'in-app',
          isPremium: false,
          createdAt: '2023-01-15T12:00:00Z'
        },
        {
          _id: '2',
          title: 'Body Scan',
          description: 'Gradually focus your attention on different parts of your body.',
          duration: 10,
          audioUrl: 'https://example.com/audio/bodyscan.mp3',
          category: 'guided',
          type: 'in-app',
          isPremium: false,
          createdAt: '2023-02-20T14:30:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId, currentRole) => {
    try {
      const backendPort = localStorage.getItem('backendPort') || '5001';
      await axios.put(`http://localhost:${backendPort}/admin/users/${userId}/role`, {
        role: currentRole === 'admin' ? 'user' : 'admin'
      });
      fetchData();
    } catch (err) {
      console.error('Error updating user role:', err);
      // Mock update for development
      setUsers(users.map(user => 
        user._id === userId 
          ? {...user, role: currentRole === 'admin' ? 'user' : 'admin'} 
          : user
      ));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.audioUrl.trim()) errors.audioUrl = 'Audio URL is required';
    if (formData.duration < 1) errors.duration = 'Duration must be at least 1 minute';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const backendPort = localStorage.getItem('backendPort') || '5001';
      if (editingId) {
        await axios.put(`http://localhost:${backendPort}/api/meditations/${editingId}`, formData);
      } else {
        await axios.post(`http://localhost:${backendPort}/api/meditations`, formData);
      }
      
      // Update local state
      if (editingId) {
        setMeditations(prev => prev.map(m => m._id === editingId ? { ...formData, _id: editingId } : m));
      } else {
        const newMeditation = {
          ...formData,
          _id: Date.now().toString(), // Temporary ID for frontend
          createdAt: new Date().toISOString()
        };
        setMeditations(prev => [...prev, newMeditation]);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        duration: 5,
        audioUrl: '',
        category: 'guided',
        type: 'guided',
        isPremium: false
      });
      setEditingId(null);
      
    } catch (err) {
      console.error('Error saving meditation:', err);
      alert('Error saving meditation. Please try again.');
    }
  };

  const handleEdit = (meditation) => {
    setFormData({
      title: meditation.title,
      description: meditation.description,
      duration: meditation.duration,
      audioUrl: meditation.audioUrl,
      category: meditation.category,
      type: meditation.type || 'guided',
      isPremium: meditation.isPremium
    });
    setEditingId(meditation._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meditation?')) return;
    
    try {
      const backendPort = localStorage.getItem('backendPort') || '5001';
      await axios.delete(`http://localhost:${backendPort}/api/meditations/${id}`);
      setMeditations(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      console.error('Error deleting meditation:', err);
      alert('Error deleting meditation. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      duration: 5,
      audioUrl: '',
      category: 'guided',
      type: 'guided',
      isPremium: false
    });
    setEditingId(null);
    setFormErrors({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-gray-50 -mt-8 -mx-4">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 h-full">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>
        <nav className="mt-5 px-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md w-full mb-1 ${
              activeTab === 'dashboard' 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <ChartBarIcon className="mr-3 h-5 w-5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md w-full mb-1 ${
              activeTab === 'users' 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <UserIcon className="mr-3 h-5 w-5" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md w-full mb-1 ${
              activeTab === 'content' 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <DocumentTextIcon className="mr-3 h-5 w-5" />
            Content Management
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md w-full mb-1 ${
              activeTab === 'activity' 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <ClockIcon className="mr-3 h-5 w-5" />
            Activity Log
          </button>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 mr-4">
                    <UserIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <p className="text-2xl font-semibold">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <span className="text-xl text-green-600">😊</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Mood Entries</p>
                    <p className="text-2xl font-semibold">{stats.totalMoods}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <span className="text-xl text-blue-600">📝</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Journal Entries</p>
                    <p className="text-2xl font-semibold">{stats.totalJournals}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 mr-4">
                    <span className="text-xl text-purple-600">🧘</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Meditations</p>
                    <p className="text-2xl font-semibold">{stats.totalMeditations}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-900">New user registered</p>
                    <p className="text-xs text-gray-500">Today, 10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-sm text-green-600">😊</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-900">5 new mood entries</p>
                    <p className="text-xs text-gray-500">Yesterday, 3:45 PM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm text-blue-600">📝</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-900">3 new journal entries</p>
                    <p className="text-xs text-gray-500">Yesterday, 2:15 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleUserRole(user._id, user.role)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'content' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Content Management</h2>
            <p className="text-gray-600">Manage application content from here.</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2">Meditation Content</h3>
                <p className="text-gray-600 mb-4">Manage guided meditations</p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md">
                  Manage Meditations
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2">Resource Library</h3>
                <p className="text-gray-600 mb-4">Manage wellbeing resources</p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-md">
                  Manage Resources
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Activity Log</h2>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">John Doe</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Added mood entry</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Today, 10:30 AM</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Created journal entry</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Yesterday, 3:45 PM</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Admin User</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Changed user role</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">2 days ago, 11:20 AM</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 