import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaceSmileIcon, FaceFrownIcon, TrashIcon, ChartBarIcon, CalendarIcon, PencilIcon } from '@heroicons/react/24/outline';
import { MinusCircleIcon } from '@heroicons/react/24/solid';
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
  const [chartMode, setChartMode] = useState('calendar'); // 'calendar' or 'graph'
  const [deleting, setDeleting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [analytics, setAnalytics] = useState({
    mostFrequentMood: null,
    moodDistribution: { happy: 0, neutral: 0, sad: 0 },
    commonActivities: [],
    streakDays: 0
  });

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
    { name: 'Nature', icon: '🌳' },
    { name: 'Music', icon: '🎵' },
  ];

  useEffect(() => {
    fetchMoods();
  }, []);

  useEffect(() => {
    if (moods.length > 0) {
      calculateAnalytics();
    }
  }, [moods]);

  const fetchMoods = async () => {
    try {
      // Use relative URL for API calls
      const res = await axios.get('/api/mood');
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

  const calculateAnalytics = () => {
    // Skip placeholders
    const validMoods = moods.filter(m => !m.placeholder && m.mood);
    
    if (validMoods.length === 0) return;

    // Calculate mood distribution
    const moodCounts = { happy: 0, neutral: 0, sad: 0 };
    validMoods.forEach(mood => {
      if (mood.mood in moodCounts) {
        moodCounts[mood.mood]++;
      }
    });

    // Find most frequent mood
    const mostFrequentMood = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0][0];

    // Count activities
    const activityCount = {};
    validMoods.forEach(mood => {
      if (mood.activities && mood.activities.length) {
        mood.activities.forEach(activity => {
          activityCount[activity] = (activityCount[activity] || 0) + 1;
        });
      }
    });

    // Get top 3 activities
    const commonActivities = Object.entries(activityCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([activity]) => activity);

    // Calculate streak
    let streakDays = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    const dates = validMoods
      .map(mood => new Date(mood.createdAt).setHours(0, 0, 0, 0))
      .sort((a, b) => b - a); // Sort descending

    if (dates.length > 0 && dates[0] === today) {
      streakDays = 1;
      let previousDate = today;
      
      for (let i = 1; i < dates.length; i++) {
        const diff = (previousDate - dates[i]) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          streakDays++;
          previousDate = dates[i];
        } else {
          break;
        }
      }
    }

    setAnalytics({
      mostFrequentMood,
      moodDistribution: moodCounts,
      commonActivities,
      streakDays
    });
  };

  const generateMockData = () => {
    const mockMoods = [];
    const moodValues = ['happy', 'neutral', 'sad'];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      if (Math.random() > 0.2) { // 80% chance of having a mood entry for the day
        mockMoods.push({
          _id: `mock-${i}`,
          mood: moodValues[Math.floor(Math.random() * moodValues.length)],
          intensity: Math.floor(Math.random() * 5) + 3, // random intensity between 3-7
          activities: [
            activityOptions[Math.floor(Math.random() * activityOptions.length)].name,
            ...(Math.random() > 0.5 ? [activityOptions[Math.floor(Math.random() * activityOptions.length)].name] : [])
          ],
          notes: i % 5 === 0 ? 'Feeling reflective today.' : '',
          createdAt: date.toISOString(),
        });
      }
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
    setEditMode(false);
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
      if (editMode && selectedMood) {
        // Update existing mood
        await axios.put(`/api/mood/${selectedMood._id}`, moodData);
        setEditMode(false);
        setSelectedMood(null);
      } else {
        // Create new mood
        await axios.post('/api/mood', moodData);
      }
      fetchMoods();
      setFormData({ mood: '', intensity: 5, activities: [], notes: '' });
    } catch (err) {
      console.error('Error submitting mood:', err);
      // Add mock entry for demonstration
      if (editMode && selectedMood) {
        setMoods(moods.map(m => 
          m._id === selectedMood._id ? { ...m, ...moodData } : m
        ));
        setEditMode(false);
        setSelectedMood(null);
      } else {
        setMoods([...moods, {
          _id: `mock-${Date.now()}`,
          ...moodData,
          createdAt: new Date().toISOString(),
        }]);
      }
      setFormData({ mood: '', intensity: 5, activities: [], notes: '' });
    }
  };

  const editMood = (mood) => {
    setSelectedMood(mood);
    setEditMode(true);
    setFormData({
      mood: mood.mood,
      intensity: mood.intensity,
      activities: mood.activities || [],
      notes: mood.notes || ''
    });
    // Scroll to the form
    document.getElementById('mood-form').scrollIntoView({ behavior: 'smooth' });
  };

  const deleteMood = async (id) => {
    if (!id || deleting) return;
    
    try {
      setDeleting(true);
      await axios.delete(`/api/mood/${id}`);
      
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
  
  // Calculate mood percentages for the chart
  const totalMoods = Object.values(analytics.moodDistribution).reduce((a, b) => a + b, 0);
  const moodPercentages = {
    happy: totalMoods ? Math.round((analytics.moodDistribution.happy / totalMoods) * 100) : 0,
    neutral: totalMoods ? Math.round((analytics.moodDistribution.neutral / totalMoods) * 100) : 0,
    sad: totalMoods ? Math.round((analytics.moodDistribution.sad / totalMoods) * 100) : 0
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-primary-100 to-primary-50 p-6 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">Mood Journey</h1>
        <p className="mt-2 text-gray-600">
          Track your daily moods and activities to better understand your emotional well-being.
        </p>
        
        {/* Summary stats */}
        {totalMoods > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Current Streak</h3>
              <div className="mt-1 flex items-center">
                <span className="text-2xl font-bold text-primary-600">{analytics.streakDays}</span>
                <span className="ml-1 text-gray-600">days</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Common Mood</h3>
              <div className="mt-1 flex items-center">
                <span className="text-2xl">{getMoodEmoji(analytics.mostFrequentMood)}</span>
                <span className="ml-2 font-medium capitalize">
                  {analytics.mostFrequentMood}
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm col-span-1 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Common Activities</h3>
              <div className="mt-1 flex flex-wrap gap-1">
                {analytics.commonActivities.map((activity, idx) => (
                  <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {activityOptions.find(a => a.name === activity)?.icon} {activity}
                  </span>
                ))}
                {analytics.commonActivities.length === 0 && (
                  <span className="text-gray-500 text-sm">No activities recorded yet</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analytics and Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Mood Analytics</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setChartMode('calendar')}
              className={`flex items-center px-3 py-1 rounded-md ${chartMode === 'calendar' 
                ? 'bg-primary-100 text-primary-700 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Calendar
            </button>
            <button 
              onClick={() => setChartMode('graph')}
              className={`flex items-center px-3 py-1 rounded-md ${chartMode === 'graph' 
                ? 'bg-primary-100 text-primary-700 font-medium' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <ChartBarIcon className="h-4 w-4 mr-1" />
              Chart
            </button>
          </div>
        </div>
        
        {chartMode === 'graph' && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Mood Distribution</h3>
            <div className="h-8 w-full bg-gray-200 rounded-full overflow-hidden">
              {moodPercentages.happy > 0 && (
                <div 
                  className="h-full bg-green-400 float-left text-xs text-center text-white"
                  style={{ width: `${moodPercentages.happy}%` }}
                >
                  {moodPercentages.happy > 10 && `${moodPercentages.happy}%`}
                </div>
              )}
              {moodPercentages.neutral > 0 && (
                <div 
                  className="h-full bg-yellow-400 float-left text-xs text-center text-white"
                  style={{ width: `${moodPercentages.neutral}%` }}
                >
                  {moodPercentages.neutral > 10 && `${moodPercentages.neutral}%`}
                </div>
              )}
              {moodPercentages.sad > 0 && (
                <div 
                  className="h-full bg-red-400 float-left text-xs text-center text-white"
                  style={{ width: `${moodPercentages.sad}%` }}
                >
                  {moodPercentages.sad > 10 && `${moodPercentages.sad}%`}
                </div>
              )}
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-400 mr-1"></div>
                <span className="text-xs text-gray-600">Happy</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-yellow-400 mr-1"></div>
                <span className="text-xs text-gray-600">Neutral</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-400 mr-1"></div>
                <span className="text-xs text-gray-600">Sad</span>
              </div>
            </div>
          </div>
        )}
        
        {chartMode === 'calendar' && (
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-sm font-medium text-gray-500">Mood Calendar</h3>
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
        )}
        
        {chartMode === 'calendar' && (
          <div className="mt-2 overflow-auto">
            <div className="grid grid-cols-7 gap-2">
              {viewMode === 'week' && 
                ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-xs text-center text-gray-500 font-medium py-1">{day}</div>
                ))
              }
              
              {moodData.map((mood) => {
                const date = new Date(mood.createdAt);
                return (
                  <div 
                    key={mood._id} 
                    className={`relative rounded-lg border ${
                      mood.placeholder 
                        ? 'border-gray-200 bg-gray-50'
                        : 'border-gray-200 hover:border-primary-300 cursor-pointer shadow-sm transition-all'
                    }`}
                    onClick={() => !mood.placeholder && handleMoodClick(mood)}
                  >
                    <div className="p-2 text-center">
                      <div className="text-xs text-gray-500 mb-1">
                        {viewMode === 'month' && date.getDate()}
                      </div>
                      {mood.placeholder ? (
                        <div className="h-8 flex items-center justify-center">
                          <span className="text-gray-300 text-xs">No data</span>
                        </div>
                      ) : (
                        <div 
                          className="h-8 w-8 mx-auto rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${getMoodColor(mood.mood)}25` }}
                        >
                          <span className="text-xl">{getMoodEmoji(mood.mood)}</span>
                        </div>
                      )}
                    </div>
                    
                    {selectedMood && selectedMood._id === mood._id && (
                      <div className="absolute top-full left-0 right-0 z-10 mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-lg animate-fadeIn">
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
                          <div className="flex items-center space-x-2">
                            <span className="text-3xl">{getMoodEmoji(mood.mood)}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                editMood(mood);
                              }}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                              title="Edit mood entry"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
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
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div id="mood-form" className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? 'Edit your mood entry' : 'How are you feeling today?'}
        </h2>
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
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2">
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

          <div className="flex justify-end space-x-3">
            {editMode && (
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setFormData({ mood: '', intensity: 5, activities: [], notes: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!formData.mood}
              className={`px-6 py-2 rounded-md text-white ${
                formData.mood 
                  ? 'bg-primary-600 hover:bg-primary-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {editMode ? 'Update Mood' : 'Save Mood'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoodTracker; 