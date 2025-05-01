import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MOODS = [
  { name: 'Energetic', position: { top: '20%', left: '50%' }, route: '/energetic' },
  { name: 'Anxious', position: { top: '35%', left: '50%' }, route: '/anxious' },
  { name: 'Depressed', position: { top: '44%', left: '45%' }, route: '/depressed' },
  { name: 'Lethargic', position: { top: '48%', left: '50%' }, route: '/lethargic' },
  { name: 'Sad', position: { top: '48%', left: '58%' }, route: '/sad' },
  { name: 'Lonely', position: { top: '48%', left: '40%' }, route: '/lonely' },
  { name: 'Bored', position: { top: '53%', left: '50%' }, route: '/bored' },
  { name: 'Chill', position: { top: '65%', left: '50%' }, route: '/chill' },
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
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-pink-200 via-blue-200 to-pink-200 opacity-80"></div>
      
      {/* Content container */}
      <div 
        className={`relative w-full h-full max-w-3xl mx-auto flex flex-col items-center justify-center transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* App logo */}
        <div className="absolute top-10 left-10">
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-white"></div>
          </div>
        </div>
        
        {/* Main question */}
        <h1 className="text-2xl md:text-3xl font-medium text-white text-center mb-24">
          How do you currently feel?
        </h1>
        
        {/* Mood options */}
        <div className="relative w-full h-80 md:h-96">
          {MOODS.map((mood) => (
            <div 
              key={mood.name}
              className={`absolute transform -translate-x-1/2 transition-all duration-300 hover:scale-110 cursor-pointer ${selectedMood === mood.name ? 'scale-125' : ''}`}
              style={{ 
                top: mood.position.top, 
                left: mood.position.left,
              }}
              onClick={() => handleMoodSelect(mood.name)}
            >
              {/* Selected indicator dot */}
              {selectedMood === mood.name && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full animate-pulse shadow-glow"></div>
              )}
              
              <span className={`text-white font-medium text-xl md:text-2xl transition-all ${selectedMood === mood.name ? 'font-bold' : 'opacity-80'}`}>
                {mood.name}
              </span>
            </div>
          ))}
        </div>
        
        {/* Next button */}
        {selectedMood && (
          <button 
            onClick={handleNext}
            className="absolute bottom-10 right-10 bg-white text-blue-500 px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center animate-fadeIn"
          >
            <span className="mr-2">Next</span>
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