import { useState, useEffect, useRef, memo } from 'react';

const BreathingVisualizer = ({ isActive, inhaleDuration = 4, exhaleDuration = 6 }) => {
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [counter, setCounter] = useState(0);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const phaseChangeRef = useRef(false);

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
            phaseChangeRef.current = true;
            return 0;
          } else if (breathPhase === 'exhale' && newCounter >= exhaleDuration) {
            setBreathPhase('inhale');
            phaseChangeRef.current = true;
            return 0;
          }
          
          return newCounter;
        });
      }
      
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    // Clean up animation frame on unmount or when parameters change
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive, breathPhase, inhaleDuration, exhaleDuration]);

  // Calculate size and opacity based on breath phase and counter - memoized calculation
  const animationStyles = (() => {
    if (breathPhase === 'inhale') {
      // Start small and grow to full size during inhale
      const progress = Math.min(counter / inhaleDuration, 1);
      const size = 100 + progress * 120; // 100px to 220px (larger)
      const opacity = 0.3 + progress * 0.5; // 0.3 to 0.8
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
        transform: `scale(${1 + progress * 0.2})`, // Add subtle scale effect
      };
    } else {
      // Start large and shrink during exhale
      const progress = Math.min(counter / exhaleDuration, 1);
      const size = 220 - progress * 120; // 220px to 100px
      const opacity = 0.8 - progress * 0.5; // 0.8 to 0.3
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
        transform: `scale(${1.2 - progress * 0.2})`, // Add subtle scale effect
      };
    }
  })();
  
  // Calculate text opacity for fade effect
  const textOpacity = breathPhase === 'inhale' 
    ? Math.min(counter / (inhaleDuration * 0.4), 1) 
    : Math.min(counter / (exhaleDuration * 0.4), 1);

  // Visual feedback for phase changes - subtle flash effect
  useEffect(() => {
    if (phaseChangeRef.current) {
      phaseChangeRef.current = false;
    }
  }, [breathPhase]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex justify-center items-center mb-12 h-64 w-64">
        {/* Outermost glow layer */}
        <div 
          className="absolute rounded-full bg-gradient-to-r from-primary-300 to-blue-300 transition-all duration-700 ease-in-out"
          style={{
            ...animationStyles,
            filter: 'blur(30px)',
            zIndex: 0,
            opacity: animationStyles.opacity * 0.5
          }}
        />
        
        {/* Middle glow layer */}
        <div 
          className="absolute rounded-full bg-gradient-to-br from-primary-400 to-purple-300 transition-all duration-700 ease-in-out"
          style={{
            ...animationStyles,
            filter: 'blur(20px)',
            zIndex: 1,
            transform: `${animationStyles.transform} rotate(${breathPhase === 'inhale' ? '0deg' : '45deg'})`,
            opacity: animationStyles.opacity * 0.7
          }}
        />
        
        {/* Inner glow layer */}
        <div 
          className="absolute rounded-full bg-gradient-to-tr from-primary-100 to-primary-300 transition-all duration-700 ease-in-out"
          style={{
            ...animationStyles,
            filter: 'blur(5px)',
            zIndex: 2
          }}
        />
        
        {/* Core circle */}
        <div 
          className="absolute rounded-full bg-gradient-to-br from-white to-primary-100 transition-all duration-700 ease-in-out shadow-lg"
          style={{
            width: animationStyles.width * 0.8,
            height: animationStyles.height * 0.8,
            opacity: animationStyles.opacity + 0.2,
            zIndex: 3
          }}
        />
        
        {/* Particles effect with reduced number for better performance */}
        <div className="absolute inset-0 z-2 overflow-hidden rounded-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: '4px',
                height: '4px',
                opacity: 0.7,
                top: `${30 + Math.sin(i * 60 + counter) * 30}%`,
                left: `${30 + Math.cos(i * 60 + counter) * 30}%`,
                animation: `floatParticle ${3 + i * 0.5}s infinite linear`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
        
        {/* Instruction text with fade effect and enhanced visibility */}
        <div 
          className="relative z-10 text-white text-xl font-medium transition-opacity duration-300 bg-primary-500 bg-opacity-30 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg"
          style={{ opacity: textOpacity }}
        >
          {breathPhase === 'inhale' ? 'Breathe In' : 'Breathe Out'}
        </div>
      </div>
      
      <div className="text-gray-600 mb-8 text-center font-medium">
        {breathPhase === 'inhale' 
          ? `Inhale: ${Math.ceil(inhaleDuration - counter)} seconds remaining` 
          : `Exhale: ${Math.ceil(exhaleDuration - counter)} seconds remaining`
        }
      </div>
      
      <div className="flex gap-12 items-center bg-gray-50 p-4 rounded-xl shadow-inner">
        <div className="flex flex-col items-center">
          <span className="text-gray-700 text-sm mb-1">Inhale</span>
          <span className="text-primary-700 font-medium text-xl">{inhaleDuration}s</span>
        </div>
        <div className="h-10 w-px bg-gray-200"></div>
        <div className="flex flex-col items-center">
          <span className="text-gray-700 text-sm mb-1">Exhale</span>
          <span className="text-primary-700 font-medium text-xl">{exhaleDuration}s</span>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(BreathingVisualizer); 