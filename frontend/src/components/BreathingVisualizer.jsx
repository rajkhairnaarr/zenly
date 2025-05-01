import { useState, useEffect, useRef } from 'react';

const BreathingVisualizer = ({ isActive, inhaleDuration = 4, exhaleDuration = 6 }) => {
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [counter, setCounter] = useState(0);
  const requestRef = useRef();
  const previousTimeRef = useRef();

  useEffect(() => {
    if (!isActive) return;
    
    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        
        // Update counter based on time passed (converting to seconds)
        setCounter(prevCounter => {
          const newCounter = prevCounter + deltaTime / 1000;
          
          // Reset counter and switch breath phase when appropriate
          if (breathPhase === 'inhale' && newCounter >= inhaleDuration) {
            setBreathPhase('exhale');
            return 0;
          } else if (breathPhase === 'exhale' && newCounter >= exhaleDuration) {
            setBreathPhase('inhale');
            return 0;
          }
          
          return newCounter;
        });
      }
      
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isActive, breathPhase, inhaleDuration, exhaleDuration]);

  // Calculate size and opacity based on breath phase and counter
  const getAnimationStyles = () => {
    if (breathPhase === 'inhale') {
      // Start small and grow to full size during inhale
      const progress = Math.min(counter / inhaleDuration, 1);
      const size = 100 + progress * 100; // 100px to 200px
      const opacity = 0.3 + progress * 0.5; // 0.3 to 0.8
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
      };
    } else {
      // Start large and shrink during exhale
      const progress = Math.min(counter / exhaleDuration, 1);
      const size = 200 - progress * 100; // 200px to 100px
      const opacity = 0.8 - progress * 0.5; // 0.8 to 0.3
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
      };
    }
  };

  const animationStyles = getAnimationStyles();

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex justify-center items-center mb-8">
        <div 
          className="absolute rounded-full bg-primary-500 transition-all duration-100"
          style={{
            ...animationStyles,
            filter: 'blur(20px)',
            zIndex: 0
          }}
        />
        <div 
          className="absolute rounded-full bg-primary-200 transition-all duration-100"
          style={animationStyles}
        />
        <div className="relative z-10 text-white text-lg font-medium">
          {breathPhase === 'inhale' ? 'Breathe In' : 'Breathe Out'}
        </div>
      </div>
      
      <div className="text-gray-600 mb-6">
        {breathPhase === 'inhale' 
          ? `Inhale: ${Math.ceil(inhaleDuration - counter)} seconds remaining` 
          : `Exhale: ${Math.ceil(exhaleDuration - counter)} seconds remaining`
        }
      </div>
      
      <div className="flex gap-8 items-center">
        <div className="flex flex-col items-center">
          <span className="text-gray-700 text-sm mb-1">Inhale</span>
          <span className="text-primary-700 font-medium">{inhaleDuration}s</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-gray-700 text-sm mb-1">Exhale</span>
          <span className="text-primary-700 font-medium">{exhaleDuration}s</span>
        </div>
      </div>
    </div>
  );
};

export default BreathingVisualizer; 