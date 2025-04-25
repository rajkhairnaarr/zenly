import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaceSmileIcon, FaceFrownIcon } from '@heroicons/react/24/outline';
import { MinusCircleIcon } from '@heroicons/react/24/outline';

const MoodTracker = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    mood: '',
    intensity: 5,
    activities: [],
    notes: '',
  });

  const moodOptions = [
    { value: 'happy', label: 'Happy', icon: FaceSmileIcon, emoji: '😊' },
    { value: 'neutral', label: 'Neutral', icon: MinusCircleIcon, emoji: '😐' },
    { value: 'sad', label: 'Sad', icon: FaceFrownIcon, emoji: '😔' },
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
      // Generate mock data for the last 7 days
      const mockData = generateMockData();
      setMoods(mockData);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockMoods = [];
    const moodValues = ['happy', 'neutral', 'sad'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      mockMoods.push({
        _id: `mock-${i}`,
        mood: moodValues[Math.floor(Math.random() * moodValues.length)],
        activities: [activityOptions[Math.floor(Math.random() * activityOptions.length)].name],
        notes: '',
        createdAt: date.toISOString(),
      });
    }
    
    return mockMoods;
  };

  const getMoodEmoji = (moodValue) => {
    const mood = moodOptions.find(m => m.value === moodValue);
    return mood ? mood.emoji : '😐';
  };

  const getMoodValue = (moodType) => {
    switch (moodType) {
      case 'happy': return 3;
      case 'neutral': return 2;
      case 'sad': return 1;
      default: return 2;
    }
  };

  const getLast7DaysMoods = () => {
    return moods
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(-7);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const moodData = getLast7DaysMoods();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mood Tracker</h1>
        <p className="mt-2 text-gray-600">
          Track your daily moods and activities to better understand your emotional well-being.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Your Mood History</h2>
        <div className="h-64 relative">
          {/* Custom mood graph without Chart.js */}
          <div className="absolute left-0 h-full flex flex-col justify-between py-2 text-sm text-gray-600">
            <div>Happy 😊</div>
            <div>Neutral 😐</div>
            <div>Sad 😔</div>
          </div>
          <div className="ml-16 h-full bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="h-full flex items-end">
              {moodData.map((mood, index) => {
                const moodValue = getMoodValue(mood.mood);
                const height = `${(moodValue / 3) * 100}%`;
                const day = new Date(mood.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
                
                return (
                  <div key={mood._id} className="flex-1 flex flex-col items-center">
                    <div className="text-lg mb-1">{getMoodEmoji(mood.mood)}</div>
                    <div 
                      className="w-4/5 bg-primary-200 rounded-t-lg relative"
                      style={{ height }}
                    ></div>
                    <div className="text-xs mt-2 text-gray-500">{day}</div>
                  </div>
                );
              })}
            </div>
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
    </div>
  );
};

export default MoodTracker; 