import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import axios from 'axios';
import BreathingVisualizer from '../components/BreathingVisualizer';
import BreathingSettings from '../components/BreathingSettings';
import { CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// Memoize the session instruction component for better performance
const SessionInstruction = memo(({ instruction }) => (
  <div className="text-xl text-center text-gray-700 mb-8 max-w-md">
    {instruction}
  </div>
));

// Memoize the meditation card component
const MeditationCard = memo(({ meditation, onStart }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden group hover:shadow-lg transition-all">
    <div className="p-6">
      <div className="text-center mb-4">
        <span className="inline-block p-3 rounded-full bg-primary-100 text-primary-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 text-center">{meditation.title}</h3>
      <p className="mt-3 text-gray-600 text-center">{meditation.description}</p>
      <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">
          {meditation.duration} minutes
        </span>
        <button
          onClick={() => onStart(meditation)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors group-hover:scale-105 transform duration-200"
        >
          Start
        </button>
      </div>
    </div>
  </div>
));

const MeditationLibrary = () => {
  const [meditations, setMeditations] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionStep, setSessionStep] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [breathingSettings, setBreathingSettings] = useState({
    inhaleDuration: 4,
    exhaleDuration: 6
  });
  const [dailySuggestion, setDailySuggestion] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const timerRef = useRef(null);

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
    },
    {
      id: "O-6f5wQXSu8",
      title: "Meditation for Deep Sleep",
      description: "A gentle 20-minute meditation to help you fall into a deep, restful sleep.",
      thumbnail: `https://img.youtube.com/vi/O-6f5wQXSu8/mqdefault.jpg`,
      duration: "20:00"
    },
    {
      id: "inpok4MKVLM",
      title: "5-Minute Meditation for Busy Days",
      description: "A quick 5-minute meditation to center yourself during hectic days.",
      thumbnail: `https://img.youtube.com/vi/inpok4MKVLM/mqdefault.jpg`,
      duration: "5:00"
    },
    {
      id: "cZrrfQIDrGk",
      title: "Guided Chakra Balance Meditation",
      description: "A 25-minute meditation to align and balance your energy centers.",
      thumbnail: `https://img.youtube.com/vi/cZrrfQIDrGk/mqdefault.jpg`,
      duration: "25:00"
    },
    {
      id: "wruCWicGBA4",
      title: "Nature Sounds Meditation",
      description: "Relax with calming nature sounds in this 15-minute guided meditation.",
      thumbnail: `https://img.youtube.com/vi/wruCWicGBA4/mqdefault.jpg`,
      duration: "15:00"
    },
    {
      id: "EwQkfoKxjuo",
      title: "Body Awareness Meditation",
      description: "A 12-minute meditation to increase awareness of bodily sensations.",
      thumbnail: `https://img.youtube.com/vi/EwQkfoKxjuo/mqdefault.jpg`,
      duration: "12:00"
    },
    {
      id: "7LrF4F9iKoc",
      title: "Gratitude Meditation",
      description: "Cultivate gratitude and appreciation with this 10-minute guided practice.",
      thumbnail: `https://img.youtube.com/vi/7LrF4F9iKoc/mqdefault.jpg`,
      duration: "10:00"
    },
    {
      id: "L3zP9P9AjnA",
      title: "Meditation for Self-Acceptance",
      description: "A loving 18-minute meditation to develop self-acceptance and compassion.",
      thumbnail: `https://img.youtube.com/vi/L3zP9P9AjnA/mqdefault.jpg`,
      duration: "18:00"
    },
    {
      id: "nAzQHnDsbOE",
      title: "Breath Awareness Meditation",
      description: "Focus on your breath with this centering 8-minute meditation.",
      thumbnail: `https://img.youtube.com/vi/nAzQHnDsbOE/mqdefault.jpg`,
      duration: "8:00"
    },
    {
      id: "SzJn0WQJQQA",
      title: "Evening Relaxation Meditation",
      description: "Wind down with this calming 15-minute evening meditation practice.",
      thumbnail: `https://img.youtube.com/vi/SzJn0WQJQQA/mqdefault.jpg`,
      duration: "15:00"
    },
    {
      id: "QHkXvPq2pQE",
      title: "Walking Meditation Guide",
      description: "Learn the practice of mindful walking in this 10-minute guided meditation.",
      thumbnail: `https://img.youtube.com/vi/QHkXvPq2pQE/mqdefault.jpg`,
      duration: "10:00"
    }
  ];

  // Meditation session instructions for each type
  const meditationInstructions = {
    "1": [
      "Find a comfortable seated position, with your back straight and shoulders relaxed.",
      "Close your eyes and take a few deep breaths.",
      "Feel the sensation of your breath as it enters and leaves your nostrils.",
      "When your mind wanders, gently bring your attention back to your breath.",
      "Continue breathing naturally, maintaining awareness of each breath."
    ],
    "2": [
      "Sit or lie down in a comfortable position and close your eyes.",
      "Begin by bringing attention to your toes, noticing any sensations.",
      "Slowly move your awareness up through your feet, ankles, and legs.",
      "Continue moving attention through your torso, arms, neck, and finally to your head.",
      "Notice any areas of tension and try to relax them with each breath."
    ],
    "3": [
      "Sit comfortably with your eyes closed and take a few deep breaths.",
      "Visualize someone you care about deeply and wish them happiness.",
      "Silently repeat: 'May you be happy. May you be healthy. May you be safe.'",
      "Extend these wishes to yourself, then to others you know, then to all beings.",
      "Feel the warmth of compassion radiating from your heart in all directions."
    ],
    "4": [
      "Sit comfortably and focus on your breath for a few moments.",
      "Notice the natural rhythm of your heartbeat.",
      "Place one hand over your heart and breathe deeply into this area.",
      "With each exhale, imagine releasing stress and tension.",
      "Feel a sense of gratitude and appreciation growing with each breath."
    ],
    "5": [
      "Close your eyes and draw your attention to sounds around you.",
      "Notice each sound without judgment, simply observing.",
      "Gradually narrow your focus to sounds closest to you.",
      "Then bring awareness to the sound of your own breath.",
      "Finally, notice the subtle sounds of silence between breaths."
    ],
    "6": [
      "Begin by focusing on the sensation of your feet touching the ground.",
      "Notice the weight, pressure, and temperature of this contact.",
      "Slowly shift your awareness to your breath, feeling each inhale and exhale.",
      "Observe any thoughts that arise, acknowledging them without attachment.",
      "Return to your breath whenever your mind begins to wander."
    ],
    "7": [
      "Bring your awareness to the sky and visualize it as clear, vast, and blue.",
      "Notice thoughts as clouds passing through this sky, not affecting its nature.",
      "Observe each thought-cloud without getting caught up in its story.",
      "Return attention to the ever-present, spacious awareness behind all experience.",
      "Rest in this open awareness, allowing all sensations to naturally arise and pass."
    ],
    "8": [
      "Begin by taking three deep breaths, exhaling completely each time.",
      "Now breathe normally and count each breath cycle from one to ten.",
      "If you lose count, simply begin again at one without judgment.",
      "Notice the quality of each breath - is it deep or shallow, smooth or irregular?",
      "Allow your breathing to become increasingly relaxed and natural."
    ]
  };

  // Generate a daily suggestion based on day of week
  const getDailySuggestion = useCallback(() => {
    const day = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const suggestions = [
      { title: "Sunday Reflection", description: "Start your week with a calm mind", duration: 10, type: "mindfulness" },
      { title: "Monday Energy", description: "Energize your mind for the week ahead", duration: 5, type: "focus" },
      { title: "Tuesday Clarity", description: "Find clarity in your thoughts", duration: 7, type: "focus" },
      { title: "Wednesday Balance", description: "Mid-week balancing meditation", duration: 10, type: "balance" },
      { title: "Thursday Creativity", description: "Open your mind to creative thoughts", duration: 8, type: "creativity" },
      { title: "Friday Relaxation", description: "Wind down from the workweek", duration: 12, type: "relaxation" },
      { title: "Saturday Joy", description: "Cultivate joy and positivity", duration: 10, type: "gratitude" }
    ];
    
    return suggestions[day];
  }, []);

  useEffect(() => {
    // Set a daily suggestion
    setDailySuggestion(getDailySuggestion());
    
    fetchMeditations();
  }, [getDailySuggestion]);

  // Optimized timer implementation with useRef to prevent memory leaks
  useEffect(() => {
    // Clean up any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (activeSession && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
        
        // Change instruction every minute
        if (timeRemaining % 60 === 0 && sessionStep < meditationInstructions[activeSession._id].length - 1) {
          setSessionStep(prev => prev + 1);
        }
      }, 1000);
    } else if (timeRemaining === 0 && activeSession) {
      // Session complete
      setSessionCompleted(true);
      timerRef.current = setTimeout(() => {
        setActiveSession(null);
        setSessionCompleted(false);
      }, 3000);
    }
    
    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [activeSession, timeRemaining, sessionStep]);

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
          duration: 5,
          type: 'in-app'
        },
        {
          _id: '2',
          title: 'Body Scan',
          description: 'Gradually focus your attention on different parts of your body.',
          duration: 10,
          type: 'in-app'
        },
        {
          _id: '3',
          title: 'Loving-Kindness Meditation',
          description: 'Develop feelings of goodwill, kindness, and warmth towards others.',
          duration: 15,
          type: 'in-app'
        },
        {
          _id: '4',
          title: 'Gratitude Meditation',
          description: 'Cultivate appreciation and thankfulness for life\'s blessings.',
          duration: 8,
          type: 'in-app'
        },
        {
          _id: '5',
          title: 'Sound Awareness',
          description: 'Develop mindfulness by focusing on the sounds around you.',
          duration: 7,
          type: 'in-app'
        },
        {
          _id: '6',
          title: 'Grounding Meditation',
          description: 'Connect with the present moment through physical awareness.',
          duration: 6,
          type: 'in-app'
        },
        {
          _id: '7',
          title: 'Open Awareness',
          description: 'Expand your consciousness to observe all experiences without judgment.',
          duration: 12,
          type: 'in-app'
        },
        {
          _id: '8',
          title: 'Counted Breath Meditation',
          description: 'Calm the mind by counting breath cycles from one to ten.',
          duration: 9,
          type: 'in-app'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startMeditation = async (meditation) => {
    try {
      setSessionStarted(true); // Show starting animation
      
      const backendPort = localStorage.getItem('backendPort') || '5001';
      await axios.post(`http://localhost:${backendPort}/api/meditations/${meditation._id}/start`);
      
      // Delay to show starting animation
      setTimeout(() => {
        setActiveSession(meditation);
        setTimeRemaining(meditation.duration * 60);
        setSessionStep(0);
        setSessionStarted(false);
      }, 1000);
    } catch (err) {
      console.error('Error starting meditation:', err);
      
      // Provide fallback behavior when backend is not available
      setTimeout(() => {
        setActiveSession(meditation);
        setTimeRemaining(meditation.duration * 60);
        setSessionStep(0);
        setSessionStarted(false);
      }, 1000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const playYouTubeVideo = (videoId) => {
    setActiveVideo(videoId);
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  const endSession = () => {
    if (window.confirm('Are you sure you want to end this meditation session?')) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setActiveSession(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Session starting animation
  if (sessionStarted && !activeSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Preparing Your Meditation</h2>
            <p className="text-gray-600 text-center">
              Find a comfortable position and prepare to begin...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Session completion screen
  if (sessionCompleted && !activeSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <CheckCircleIcon className="h-24 w-24 text-green-500" />
            <h2 className="text-2xl font-semibold text-gray-800">Meditation Complete</h2>
            <p className="text-gray-600 text-center">
              Well done! Take a moment to notice how you feel.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeSession) {
    const progress = ((activeSession.duration * 60 - timeRemaining) / (activeSession.duration * 60)) * 100;
    const currentInstruction = meditationInstructions[activeSession._id][sessionStep];
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{activeSession.title}</h2>
            <button 
              onClick={endSession}
              className="bg-white text-primary-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-100"
            >
              End Session
            </button>
          </div>
          
          <div className="p-8 flex flex-col items-center">
            <div className="text-6xl font-extralight text-gray-800 mb-8">{formatTime(timeRemaining)}</div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
              <div 
                className="bg-primary-500 h-3 rounded-full transition-all duration-1000 ease-linear" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {activeSession.type === 'in-app' && (
              <div className="mb-8">
                <BreathingVisualizer 
                  isActive={true} 
                  inhaleDuration={breathingSettings.inhaleDuration}
                  exhaleDuration={breathingSettings.exhaleDuration}
                />
                
                {showSettings ? (
                  <div className="mt-8">
                    <BreathingSettings 
                      defaultInhale={breathingSettings.inhaleDuration}
                      defaultExhale={breathingSettings.exhaleDuration}
                      onSave={(settings) => {
                        setBreathingSettings(settings);
                        setShowSettings(false);
                      }}
                    />
                  </div>
                ) : (
                  <div className="mt-4 space-x-4">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="text-sm text-primary-600 hover:text-primary-800 underline"
                    >
                      Adjust Breathing Settings
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <SessionInstruction instruction={currentInstruction} />
            
            <div className="text-sm text-gray-500 italic text-center">
              Focus on your breath and let go of any distractions.
            </div>
          </div>
        </div>
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
      
      {/* Daily Suggestion */}
      {!activeSession && dailySuggestion && (
        <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <CalendarIcon className="h-5 w-5 text-indigo-500 mr-2" />
                Today's Meditation Suggestion
              </h3>
              <p className="mt-2 text-gray-700 font-medium">{dailySuggestion.title}</p>
              <p className="mt-1 text-gray-600">{dailySuggestion.description}</p>
              <p className="mt-1 text-sm text-gray-500">{dailySuggestion.duration} minutes • {dailySuggestion.type}</p>
              <div className="mt-4">
                <button
                  onClick={() => startMeditation({
                    title: dailySuggestion.title,
                    description: dailySuggestion.description,
                    duration: dailySuggestion.duration,
                    type: 'in-app'
                  })}
                  className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors"
                >
                  Start Daily Meditation
                </button>
              </div>
            </div>
            <div className="hidden sm:block text-6xl">
              {dailySuggestion.type === 'focus' && '🧠'}
              {dailySuggestion.type === 'mindfulness' && '🌿'}
              {dailySuggestion.type === 'relaxation' && '🌊'}
              {dailySuggestion.type === 'balance' && '☯️'}
              {dailySuggestion.type === 'creativity' && '✨'}
              {dailySuggestion.type === 'gratitude' && '🙏'}
            </div>
          </div>
        </div>
      )}
      
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
            <MeditationCard 
              key={meditation._id} 
              meditation={meditation}
              onStart={startMeditation}
            />
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

export default memo(MeditationLibrary); 