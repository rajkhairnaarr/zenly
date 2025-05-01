import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MOODS = [
  { name: 'Energetic', position: { top: '15%', left: '50%' }, route: '/energetic', color: 'bg-yellow-400', textColor: 'text-yellow-800' },
  { name: 'Anxious', position: { top: '30%', left: '75%' }, route: '/anxious', color: 'bg-indigo-400', textColor: 'text-indigo-800' },
  { name: 'Depressed', position: { top: '50%', left: '85%' }, route: '/depressed', color: 'bg-blue-600', textColor: 'text-blue-100' },
  { name: 'Lethargic', position: { top: '70%', left: '75%' }, route: '/lethargic', color: 'bg-teal-400', textColor: 'text-teal-800' },
  { name: 'Sad', position: { top: '85%', left: '50%' }, route: '/sad', color: 'bg-purple-500', textColor: 'text-purple-100' },
  { name: 'Lonely', position: { top: '70%', left: '25%' }, route: '/lonely', color: 'bg-pink-400', textColor: 'text-pink-800' },
  { name: 'Bored', position: { top: '50%', left: '15%' }, route: '/bored', color: 'bg-gray-400', textColor: 'text-gray-800' },
  { name: 'Chill', position: { top: '30%', left: '25%' }, route: '/chill', color: 'bg-sky-400', textColor: 'text-sky-800' },
];

const MoodOnboarding = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  // Fade in the content when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleNext = () => {
    if (selectedMood) {
      // Find the selected mood's route
      const selectedMoodData = MOODS.find(m => m.name === selectedMood);
      if (selectedMoodData) {
        navigate(selectedMoodData.route);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100">
      {/* Content container */}
      <div 
        className={`relative w-full h-full max-w-4xl mx-auto flex flex-col items-center justify-center transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* App logo - Can be removed or kept based on preference */}
        {/* <div className="absolute top-10 left-10">
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-white"></div>
          </div>
        </div> */}
        
        {/* Main question */}
        <h1 className="text-3xl md:text-4xl font-medium text-gray-700 text-center mb-16 sm:mb-24">
          How are you feeling right now?
        </h1>
        
        {/* Mood options - Circle layout */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px]">
          {MOODS.map((mood) => (
            <div 
              key={mood.name}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out cursor-pointer group ${selectedMood === mood.name ? 'scale-110 z-10' : 'hover:scale-105'}`}
              style={{ 
                top: mood.position.top, 
                left: mood.position.left,
              }}
              onClick={() => handleMoodSelect(mood.name)}
            >
              <div className={`relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full shadow-lg transition-all duration-300 ${mood.color} ${selectedMood === mood.name ? 'ring-4 ring-white ring-offset-2 ring-offset-gray-200' : 'opacity-80 group-hover:opacity-100'}`}>
                <span className={`text-center font-medium text-sm sm:text-base px-2 ${mood.textColor} ${selectedMood === mood.name ? 'font-bold' : ''}`}>
                  {mood.name}
                </span>
                {/* Optional: Inner pulse/glow for selected */}
                {selectedMood === mood.name && (
                  <div className={`absolute inset-0 rounded-full ${mood.color} opacity-30 animate-pulse-slow`}></div>
                )}
              </div>
            </div>
          ))}
          {/* Center text (Optional) */}
          {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-gray-500">Select a mood</p>
          </div> */}
        </div>
        
        {/* Next button */}
        {selectedMood && (
          <button 
            onClick={handleNext}
            className="absolute bottom-8 sm:bottom-12 right-8 sm:right-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center animate-fadeIn text-lg font-medium"
          >
            <span className="mr-2">Continue</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MoodOnboarding; 