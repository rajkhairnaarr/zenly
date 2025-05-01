import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaceSmileIcon, FaceFrownIcon, TrashIcon } from '@heroicons/react/24/outline';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const MoodTracker = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    mood: '',
    intensity: 5,
    activities: [],
    notes: '',
  });
  const [selectedMood, setSelectedMood] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [deleting, setDeleting] = useState(false);

  const moodOptions = [
    { value: 'happy', label: 'Happy', icon: FaceSmileIcon, emoji: '😊', color: '#4ADE80' },
    { value: 'neutral', label: 'Neutral', icon: MinusCircleIcon, emoji: '😐', color: '#FBBF24' },
    { value: 'sad', label: 'Sad', icon: FaceFrownIcon, emoji: '😔', color: '#F87171' },
  ];

  const activityOptions = [
    { name: 'Exercise', icon: '🏃‍♂️' },
    { name: 'Meditation', icon: '🧘‍♀️' },
    { name: 'Reading', icon: '📚' },
    { name: 'Work', icon: '💼' },
    { name: 'Social', icon: '👥' },
    { name: 'Rest', icon: '😴' },
  ];

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const backendPort = localStorage.getItem('backendPort') || '5001';
      const res = await axios.get(`http://localhost:${backendPort}/api/mood`);
      setMoods(res.data);
    } catch (err) {
      console.error('Error fetching moods:', err);
      // Generate mock data for the last 30 days
      const mockData = generateMockData();
      setMoods(mockData);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockMoods = [];
    const moodValues = ['happy', 'neutral', 'sad'];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      mockMoods.push({
        _id: `mock-${i}`,
        mood: moodValues[Math.floor(Math.random() * moodValues.length)],
        intensity: Math.floor(Math.random() * 5) + 3, // random intensity between 3-7
        activities: [activityOptions[Math.floor(Math.random() * activityOptions.length)].name],
        notes: i % 5 === 0 ? 'Feeling reflective today.' : '',
        createdAt: date.toISOString(),
      });
    }
    
    return mockMoods;
  };

  const getMoodEmoji = (moodValue) => {
    const mood = moodOptions.find(m => m.value === moodValue);
    return mood ? mood.emoji : '😐';
  };

  const getMoodColor = (moodValue) => {
    const mood = moodOptions.find(m => m.value === moodValue);
    return mood ? mood.color : '#FBBF24';
  };

  const getMoodValue = (moodType) => {
    switch (moodType) {
      case 'happy': return 3;
      case 'neutral': return 2;
      case 'sad': return 1;
      default: return 2;
    }
  };

  const getLastNDaysMoods = (n) => {
    // Create a map to store one mood per day
    const moodMap = new Map();
    
    // Sort moods by date (most recent first)
    const sortedMoods = [...moods].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    // Group by date (keep the most recent mood for each day)
    sortedMoods.forEach(mood => {
      const date = new Date(mood.createdAt).toDateString();
      if (!moodMap.has(date)) {
        moodMap.set(date, mood);
      }
    });
    
    // Get array of moods for the last n days
    const result = [];
    for (let i = 0; i < n; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      if (moodMap.has(dateStr)) {
        result.unshift(moodMap.get(dateStr));
      } else {
        // No mood for this day, add a placeholder
        result.unshift({
          _id: `placeholder-${i}`,
          mood: null,
          createdAt: date.toISOString(),
          placeholder: true
        });
      }
    }
    
    return result;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: viewMode === 'week' ? 'short' : undefined,
      month: viewMode === 'month' ? 'short' : undefined,
      day: 'numeric'
    });
  };

  const handleMoodClick = (mood) => {
    setSelectedMood(selectedMood?._id === mood._id ? null : mood);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mood) return;
    
    // Set intensity based on mood if not already set
    const moodData = {
      ...formData,
      intensity: formData.intensity || getMoodValue(formData.mood) * 3
    };

    try {
      const backendPort = localStorage.getItem('backendPort') || '5001';
      await axios.post(`http://localhost:${backendPort}/api/mood`, moodData);
      fetchMoods();
      setFormData({ mood: '', intensity: 5, activities: [], notes: '' });
    } catch (err) {
      console.error('Error submitting mood:', err);
      // Add mock entry for demonstration
      setMoods([...moods, {
        _id: `mock-${Date.now()}`,
        ...moodData,
        createdAt: new Date().toISOString(),
      }]);
      setFormData({ mood: '', intensity: 5, activities: [], notes: '' });
    }
  };

  const deleteMood = async (id) => {
    if (!id || deleting) return;
    
    try {
      setDeleting(true);
      const backendPort = localStorage.getItem('backendPort') || '5001';
      await axios.delete(`http://localhost:${backendPort}/api/mood/${id}`);
      
      // Remove the mood from state
      setMoods(moods.filter(mood => mood._id !== id));
      
      // If this was the selected mood, unselect it
      if (selectedMood && selectedMood._id === id) {
        setSelectedMood(null);
      }
    } catch (err) {
      console.error('Error deleting mood:', err);
      // For demo purposes, remove it from the UI anyway
      setMoods(moods.filter(mood => mood._id !== id));
      if (selectedMood && selectedMood._id === id) {
        setSelectedMood(null);
      }
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

  const moodData = viewMode === 'week' ? getLastNDaysMoods(7) : getLastNDaysMoods(30);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mood Tracker</h1>
        <p className="mt-2 text-gray-600">
          Track your daily moods and activities to better understand your emotional well-being.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Mood History</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md ${viewMode === 'week' 
                ? 'bg-primary-100 text-primary-700 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md ${viewMode === 'month' 
                ? 'bg-primary-100 text-primary-700 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Month
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2 px-4">
            <div className="text-xs text-gray-500">Happy</div>
            <div className="text-xs text-gray-500">Date</div>
            <div className="text-xs text-gray-500">Sad</div>
          </div>
          
          <div className="space-y-2">
            {moodData.map((mood) => (
              <div 
                key={mood._id} 
                className={`relative ${mood.placeholder ? '' : 'cursor-pointer hover:bg-gray-50'}`}
                onClick={() => !mood.placeholder && handleMoodClick(mood)}
              >
                <div className="flex items-center justify-between px-4 py-2 rounded-lg border border-gray-200">
                  <div className="w-1/3 flex justify-start">
                    {mood.mood === 'happy' && (
                      <div className="h-4 w-16 bg-gradient-to-r from-green-300 to-transparent rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center">
                    {mood.placeholder ? (
                      <div className="text-xs text-gray-400">{formatDate(mood.createdAt)}</div>
                    ) : (
                      <>
                        <div className="text-2xl" style={{ color: getMoodColor(mood.mood) }}>{getMoodEmoji(mood.mood)}</div>
                        <div className="text-xs text-gray-500 mt-1">{formatDate(mood.createdAt)}</div>
                      </>
                    )}
                  </div>
                  
                  <div className="w-1/3 flex justify-end">
                    {mood.mood === 'sad' && (
                      <div className="h-4 w-16 bg-gradient-to-r from-transparent to-red-300 rounded-full"></div>
                    )}
                  </div>
                </div>
                
                {selectedMood && selectedMood._id === mood._id && (
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">Details</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(mood.createdAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">{getMoodEmoji(mood.mood)}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this mood entry?')) {
                              deleteMood(mood._id);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          title="Delete mood entry"
                          disabled={deleting}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    {mood.activities && mood.activities.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700">Activities:</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {mood.activities.map((activity, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              {activityOptions.find(a => a.name === activity)?.icon} {activity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {mood.notes && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700">Notes:</h4>
                        <p className="text-sm text-gray-600 mt-1">{mood.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select your mood
            </label>
            <div className="grid grid-cols-3 gap-4">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood: option.value })}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                    ${formData.mood === option.value
                      ? 'border-primary-500 bg-primary-50 transform scale-105'
                      : 'border-gray-200 hover:border-primary-200'
                    }`}
                  style={{ 
                    borderColor: formData.mood === option.value ? option.color : '',
                    backgroundColor: formData.mood === option.value ? `${option.color}15` : ''
                  }}
                >
                  <div className="text-3xl mb-2">{option.emoji}</div>
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What activities did you do today?
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {activityOptions.map((activity) => (
                <button
                  key={activity.name}
                  type="button"
                  onClick={() => {
                    const activities = formData.activities.includes(activity.name)
                      ? formData.activities.filter(a => a !== activity.name)
                      : [...formData.activities, activity.name];
                    setFormData({ ...formData, activities });
                  }}
                  className={`flex flex-col items-center p-3 rounded-lg transition-colors
                    ${formData.activities.includes(activity.name)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <span className="text-xl mb-1">{activity.icon}</span>
                  <span className="text-xs">{activity.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              rows="3"
              placeholder="How was your day? What made you feel this way?"
            />
          </div>

          <button
            type="submit"
            disabled={!formData.mood}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Save Entry
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MoodTracker; 