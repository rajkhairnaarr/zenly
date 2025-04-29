import { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, CalendarIcon, BookOpenIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral',
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const moodEmojis = {
    happy: '😊',
    neutral: '😐',
    sad: '😔',
    excited: '😃',
    anxious: '😰',
    calm: '😌',
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const backendPort = localStorage.getItem('backendPort') || '5001';
      const res = await axios.get(`http://localhost:${backendPort}/api/journal`);
      setEntries(res.data.data || res.data);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
      // Mock data for development
      setEntries([
        {
          _id: '1',
          title: 'First day of meditation',
          content: 'I tried meditation for the first time today. It was challenging to quiet my mind, but I felt more relaxed afterward.',
          mood: 'calm',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          _id: '2',
          title: 'Work stress',
          content: 'Had a difficult day at work. Going to try some breathing exercises this evening to help me relax.',
          mood: 'anxious',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendPort = localStorage.getItem('backendPort') || '5001';
      await axios.post(`http://localhost:${backendPort}/api/journal`, formData);
      setFormData({ title: '', content: '', mood: 'neutral' });
      fetchEntries();
      setShowForm(false);
    } catch (err) {
      console.error('Error creating journal entry:', err);
      // Add mock entry for demonstration
      setEntries([
        {
          _id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString()
        },
        ...entries
      ]);
      setFormData({ title: '', content: '', mood: 'neutral' });
      setShowForm(false);
    }
  };

  const deleteEntry = async (id) => {
    if (!id || deleting) return;
    
    try {
      setDeleting(true);
      const backendPort = localStorage.getItem('backendPort') || '5001';
      await axios.delete(`http://localhost:${backendPort}/api/journal/${id}`);
      
      // Remove the entry from state
      setEntries(entries.filter(entry => entry._id !== id));
    } catch (err) {
      console.error('Error deleting journal entry:', err);
      // For demo purposes, remove it from the UI anyway
      setEntries(entries.filter(entry => entry._id !== id));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal</h1>
          <p className="mt-2 text-gray-600">
            Record your thoughts, feelings, and reflections on your mindfulness journey.
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition-colors"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          <span>New Entry</span>
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out">
          <div className="bg-primary-100 px-6 py-4 border-b border-primary-200">
            <h2 className="text-xl font-semibold text-primary-800 flex items-center">
              <PencilIcon className="h-5 w-5 mr-2" />
              Create New Journal Entry
            </h2>
          </div>
          
          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="What's on your mind today?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="mood" className="block text-sm font-medium text-gray-700">
                Mood
              </label>
              <select
                id="mood"
                name="mood"
                value={formData.mood}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                  <option key={mood} value={mood}>
                    {emoji} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                rows={6}
                value={formData.content}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Write your thoughts here..."
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <BookOpenIcon className="h-16 w-16 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No journal entries yet</h3>
          <p className="mt-2 text-gray-500">Start your mindfulness journey by creating your first entry.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm hover:bg-primary-700"
          >
            Create Your First Entry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map((entry) => (
            <div key={entry._id} className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="px-6 py-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{entry.title}</h3>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2" title={entry.mood}>
                      {moodEmojis[entry.mood] || '😐'}
                    </span>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this journal entry?')) {
                          deleteEntry(entry._id);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                      title="Delete journal entry"
                      disabled={deleting}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-gray-700 whitespace-pre-line">{entry.content}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {formatDate(entry.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal; 