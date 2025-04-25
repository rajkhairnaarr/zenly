import { useState, useEffect } from 'react';
import axios from 'axios';

const MeditationLibrary = () => {
  const [meditations, setMeditations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  const guidedMeditations = [
    {
      id: "vj0JDwQLof4",
      title: "Meditation for Focus and Clarity",
      description: "A 10-minute guided meditation for improving focus and mental clarity.",
      thumbnail: `https://img.youtube.com/vi/vj0JDwQLof4/mqdefault.jpg`,
      duration: "10:00"
    },
    {
      id: "1vx8iUvfyCY",
      title: "Meditation for Stress Relief",
      description: "A calming 15-minute meditation practice to help reduce stress and anxiety.",
      thumbnail: `https://img.youtube.com/vi/1vx8iUvfyCY/mqdefault.jpg`,
      duration: "15:00"
    },
    {
      id: "PIAWiBZ_ZZM",
      title: "Morning Meditation for Positive Energy",
      description: "Start your day with this energizing 12-minute meditation to cultivate positive energy.",
      thumbnail: `https://img.youtube.com/vi/PIAWiBZ_ZZM/mqdefault.jpg`,
      duration: "12:00"
    }
  ];

  useEffect(() => {
    fetchMeditations();
  }, []);

  const fetchMeditations = async () => {
    try {
      const backendPort = localStorage.getItem('backendPort') || '5001';
      const res = await axios.get(`http://localhost:${backendPort}/api/meditations`);
      setMeditations(res.data);
    } catch (err) {
      console.error('Error fetching meditations:', err);
      setMeditations([
        {
          _id: '1',
          title: 'Breathing Meditation',
          description: 'Focus on your breath to calm your mind and body.',
          duration: 5
        },
        {
          _id: '2',
          title: 'Body Scan',
          description: 'Gradually focus your attention on different parts of your body.',
          duration: 10
        },
        {
          _id: '3',
          title: 'Loving-Kindness Meditation',
          description: 'Develop feelings of goodwill, kindness, and warmth towards others.',
          duration: 15
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startMeditation = async (meditationId) => {
    try {
      const backendPort = localStorage.getItem('backendPort') || '5001';
      await axios.post(`http://localhost:${backendPort}/api/meditations/${meditationId}/start`);
      alert(`Starting meditation session. Take a deep breath and relax.`);
    } catch (err) {
      console.error('Error starting meditation:', err);
      // Provide fallback behavior when backend is not available
      alert(`Starting meditation session. Take a deep breath and relax.`);
    }
  };

  const playYouTubeVideo = (videoId) => {
    setActiveVideo(videoId);
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meditation Library</h1>
        <p className="mt-2 text-gray-600">
          Explore guided meditations to help you relax, focus, and improve your mental well-being.
        </p>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Guided Meditations</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guidedMeditations.map((meditation) => (
            <div key={meditation.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="relative pb-[56.25%] h-0">
                <img 
                  src={meditation.thumbnail} 
                  alt={meditation.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <button
                  onClick={() => playYouTubeVideo(meditation.id)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-black bg-opacity-50 rounded-full p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{meditation.title}</h3>
                <p className="mt-2 text-gray-600">{meditation.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {meditation.duration}
                  </span>
                  <button
                    onClick={() => playYouTubeVideo(meditation.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Play
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">In-App Meditations</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meditations.map((meditation) => (
            <div key={meditation._id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{meditation.title}</h3>
                <p className="mt-2 text-gray-600">{meditation.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {meditation.duration} minutes
                  </span>
                  <button
                    onClick={() => startMeditation(meditation._id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative pb-[56.25%] h-0">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeditationLibrary; 