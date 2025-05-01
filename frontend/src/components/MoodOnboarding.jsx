import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, LightBulbIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';
import { GlobalStyles } from './MoodExperiences';

const MOODS = [
  { name: 'Energetic', position: { top: '15%', left: '50%' }, route: '/energetic', color: 'bg-yellow-400', textColor: 'text-yellow-800', emoji: '⚡️', description: 'Full of energy and ready to go' },
  { name: 'Anxious', position: { top: '30%', left: '75%' }, route: '/anxious', color: 'bg-indigo-400', textColor: 'text-indigo-800', emoji: '😰', description: 'Feeling worried or nervous' },
  { name: 'Depressed', position: { top: '50%', left: '85%' }, route: '/depressed', color: 'bg-blue-600', textColor: 'text-blue-100', emoji: '😞', description: 'Deeply sad and low on energy' },
  { name: 'Lethargic', position: { top: '70%', left: '75%' }, route: '/lethargic', color: 'bg-teal-400', textColor: 'text-teal-800', emoji: '😴', description: 'Tired and lacking motivation' },
  { name: 'Sad', position: { top: '85%', left: '50%' }, route: '/sad', color: 'bg-purple-500', textColor: 'text-purple-100', emoji: '😢', description: 'Feeling down or unhappy' },
  { name: 'Lonely', position: { top: '70%', left: '25%' }, route: '/lonely', color: 'bg-pink-400', textColor: 'text-pink-800', emoji: '🥺', description: 'Missing connection with others' },
  { name: 'Bored', position: { top: '50%', left: '15%' }, route: '/bored', color: 'bg-gray-400', textColor: 'text-gray-800', emoji: '😐', description: 'Unstimulated and looking for interest' },
  { name: 'Chill', position: { top: '30%', left: '25%' }, route: '/chill', color: 'bg-sky-400', textColor: 'text-sky-800', emoji: '😌', description: 'Relaxed and at ease' },
];

const MoodOnboarding = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const mainCircleRef = useRef(null);
  const navigate = useNavigate();

  // Fade in the content when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    const animTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(animTimer);
    };
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowTooltip(false);
  };

  const handleMoodHover = (mood, event) => {
    if (!selectedMood) {
      setTooltipContent(mood);
      
      // Calculate position based on the event target
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      
      setShowTooltip(true);
    }
  };

  const handleMoodLeave = () => {
    setShowTooltip(false);
  };

  const handleNext = () => {
    if (selectedMood) {
      // Find the selected mood's route
      const selectedMoodData = MOODS.find(m => m.name === selectedMood);
      if (selectedMoodData) {
        // Add a nice exit animation
        setShowContent(false);
        setTimeout(() => {
          navigate(selectedMoodData.route);
        }, 400);
      }
    }
  };

  const handleReset = () => {
    setSelectedMood(null);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Get the current time of day to personalize greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Calculate the size of the center circle
  useEffect(() => {
    const handleResize = () => {
      if (mainCircleRef.current) {
        const width = mainCircleRef.current.offsetWidth;
        const centerSize = Math.max(16, width * 0.12);
        mainCircleRef.current.style.setProperty('--center-size', `${centerSize}px`);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100">
      <GlobalStyles />
      
      {/* Background decorative elements with parallax effect */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Decorative circles with subtle animation */}
        <div className="absolute top-[10%] left-[10%] w-32 h-32 rounded-full bg-yellow-300 opacity-20 blur-2xl animate-float-slow"></div>
        <div className="absolute top-[30%] right-[15%] w-40 h-40 rounded-full bg-purple-400 opacity-20 blur-3xl animate-float-slower"></div>
        <div className="absolute bottom-[20%] left-[20%] w-36 h-36 rounded-full bg-blue-400 opacity-20 blur-2xl animate-float"></div>
        <div className="absolute bottom-[50%] right-[30%] w-24 h-24 rounded-full bg-pink-300 opacity-15 blur-xl animate-float-slow-reverse"></div>
      </div>
      
      {/* Content container */}
      <div 
        className={`relative w-full h-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 transition-all duration-1000 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Welcome text with animated entrance */}
        <div className="mb-12 text-center">
          <h2 className={`text-lg text-gray-600 font-medium mb-2 transition-all duration-700 ${
            animationComplete ? 'opacity-100' : 'opacity-0'
          }`}>
            {getGreeting()}
          </h2>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 tracking-tight">
            How are you feeling right now?
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto text-lg">
            Select the mood that best reflects how you're feeling, and we'll suggest personalized activities to support your wellbeing.
          </p>
        </div>
        
        {/* Navigation buttons in top corners */}
        <div className="absolute top-8 left-8">
          <button 
            onClick={handleGoHome}
            className="flex items-center justify-center p-2 bg-white bg-opacity-40 hover:bg-opacity-60 rounded-full shadow-sm transition-all duration-300"
            aria-label="Go to home"
          >
            <HomeIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        
        {/* Reset button (only visible when a mood is selected) */}
        {selectedMood && (
          <div className="absolute top-8 right-8 animate-fadeIn">
            <button 
              onClick={handleReset}
              className="flex items-center justify-center gap-1 py-1.5 px-3 bg-white bg-opacity-40 hover:bg-opacity-60 rounded-full shadow-sm transition-all duration-300 text-sm font-medium text-gray-700"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        )}
        
        {/* Mood options - Circle layout */}
        <div 
          ref={mainCircleRef}
          className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[520px] md:h-[520px] lg:w-[580px] lg:h-[580px]"
          style={{ '--center-size': '32px' }}
        >
          {/* Center circle for visual grounding */}
          <div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-500 ${
              selectedMood ? 'bg-opacity-60 shadow-lg' : 'bg-opacity-30'
            }`}
            style={{ width: 'var(--center-size)', height: 'var(--center-size)' }}
          ></div>
          
          {/* Connecting lines from center to moods */}
          {MOODS.map((mood) => (
            <div 
              key={`line-${mood.name}`}
              className={`absolute top-1/2 left-1/2 origin-center bg-white transition-all duration-500 ${
                selectedMood === mood.name ? 'opacity-60' : 'opacity-20'
              }`}
              style={{
                height: '1px',
                width: '50%',
                transform: `translate(0, 0) rotate(${
                  Object.values(MOODS).findIndex(m => m.name === mood.name) * (360 / MOODS.length)
                }deg)`,
                transformOrigin: '0 0',
              }}
              aria-hidden="true"
            ></div>
          ))}
          
          {MOODS.map((mood) => (
            <div 
              key={mood.name}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out cursor-pointer group ${
                selectedMood === mood.name 
                  ? 'scale-110 z-10' 
                  : selectedMood ? 'opacity-60 hover:opacity-100 hover:scale-105' : 'hover:scale-105 hover:z-10'
              }`}
              style={{ 
                top: mood.position.top, 
                left: mood.position.left,
              }}
              onClick={() => handleMoodSelect(mood.name)}
              onMouseEnter={(e) => handleMoodHover(mood, e)}
              onMouseLeave={handleMoodLeave}
              role="button"
              aria-pressed={selectedMood === mood.name}
              tabIndex={0}
            >
              <div 
                className={`
                  relative flex items-center justify-center 
                  w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 
                  rounded-full shadow-lg 
                  transition-all duration-300 
                  ${mood.color} 
                  ${selectedMood === mood.name 
                    ? 'ring-4 ring-white ring-opacity-70 shadow-xl' 
                    : 'opacity-85 hover:opacity-100 shadow-md'
                  }
                `}
              >
                <div className="text-center px-1">
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <span className={`text-center font-medium text-sm sm:text-base ${mood.textColor} ${selectedMood === mood.name ? 'font-bold' : ''}`}>
                    {mood.name}
                  </span>
                </div>
                
                {/* Pulsing animation for selected mood */}
                {selectedMood === mood.name && (
                  <div className={`absolute inset-0 rounded-full ${mood.color} opacity-40 animate-pulse-slow`}></div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Tips section with a nicer design */}
        <div className="absolute bottom-8 left-8 max-w-xs bg-white bg-opacity-60 backdrop-filter backdrop-blur-lg p-4 rounded-xl shadow-sm border border-white border-opacity-40">
          <div className="flex items-start">
            <LightBulbIcon className="w-5 h-5 text-yellow-500 mt-1 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Personalized Experience</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your selected activities will be tailored to help you navigate your current emotional state.
              </p>
            </div>
          </div>
        </div>
        
        {/* Selected mood details (only visible when a mood is selected) */}
        {selectedMood && (
          <div className="mt-8 max-w-md text-center animate-fadeIn">
            <h3 className="text-lg text-gray-800 font-medium mb-2">
              You selected: <span className="font-bold">{selectedMood}</span>
            </h3>
            <p className="text-gray-600">
              {MOODS.find(m => m.name === selectedMood)?.description}
            </p>
          </div>
        )}
        
        {/* Next button with improved animation */}
        {selectedMood && (
          <button 
            onClick={handleNext}
            className="absolute bottom-8 sm:bottom-12 right-8 sm:right-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 hover:translate-x-1 transition-all duration-300 flex items-center animate-fadeIn text-lg font-medium"
          >
            <span className="mr-2">Continue</span>
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        )}
        
        {/* Tooltip for mood description on hover */}
        {showTooltip && tooltipContent && (
          <div 
            className="fixed z-50 bg-black bg-opacity-75 text-white text-xs py-1 px-2 rounded pointer-events-none animate-fadeIn"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            {tooltipContent.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodOnboarding; 