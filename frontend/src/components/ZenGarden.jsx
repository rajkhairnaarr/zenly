import React, { useEffect, useState, useRef } from 'react';

// Zen Garden Element Types
const ELEMENT_TYPES = {
  ROCK: 'rock',
  RAKE: 'rake',
  LANTERN: 'lantern',
  BRIDGE: 'bridge',
  WATER: 'water'
};

// Garden configurations based on meditation streak
const GARDEN_LAYOUTS = {
  beginner: {
    rocks: { count: 3, size: { min: 20, max: 40 } },
    rakes: { count: 2 },
    lanterns: { count: 1 },
    bridges: { count: 0 },
    water: { count: 0 }
  },
  intermediate: {
    rocks: { count: 5, size: { min: 20, max: 50 } },
    rakes: { count: 3 },
    lanterns: { count: 2 },
    bridges: { count: 1 },
    water: { count: 1, size: { min: 60, max: 120 } }
  },
  advanced: {
    rocks: { count: 7, size: { min: 20, max: 60 } },
    rakes: { count: 5 },
    lanterns: { count: 3 },
    bridges: { count: 2 },
    water: { count: 2, size: { min: 80, max: 150 } }
  }
};

// Generate a layout based on streak
const getLayoutForStreak = (streak) => {
  if (streak >= 7) return GARDEN_LAYOUTS.advanced;
  if (streak >= 3) return GARDEN_LAYOUTS.intermediate;
  return GARDEN_LAYOUTS.beginner;
};

// Main ZenGarden component
const ZenGarden = ({ streak = 0, isDarkMode = false }) => {
  const [elements, setElements] = useState([]);
  const [gardenSize, setGardenSize] = useState({ width: 400, height: 300 });
  const gardenRef = useRef(null);
  
  // Function to generate random elements based on streak
  const generateElements = (layout, width, height) => {
    const newElements = [];
    
    // Add rocks
    for (let i = 0; i < layout.rocks.count; i++) {
      const size = Math.floor(
        Math.random() * (layout.rocks.size.max - layout.rocks.size.min) + layout.rocks.size.min
      );
      newElements.push({
        type: ELEMENT_TYPES.ROCK,
        x: Math.random() * (width - size),
        y: Math.random() * (height - size),
        size,
        rotation: Math.random() * 360
      });
    }
    
    // Add rakes
    for (let i = 0; i < layout.rakes.count; i++) {
      newElements.push({
        type: ELEMENT_TYPES.RAKE,
        x: Math.random() * (width - 20),
        y: Math.random() * (height - 20),
        rotation: Math.random() * 360
      });
    }
    
    // Add lanterns
    for (let i = 0; i < layout.lanterns.count; i++) {
      newElements.push({
        type: ELEMENT_TYPES.LANTERN,
        x: Math.random() * (width - 10),
        y: Math.random() * (height - 15),
        rotation: Math.random() * 10 - 5 // Slight tilt
      });
    }
    
    // Add bridges
    if (layout.bridges && layout.bridges.count > 0) {
      for (let i = 0; i < layout.bridges.count; i++) {
        const size = Math.floor(Math.random() * 40) + 60; // 60-100px
        newElements.push({
          type: ELEMENT_TYPES.BRIDGE,
          x: Math.random() * (width - size),
          y: Math.random() * (height - size / 2),
          size,
          rotation: Math.random() * 30 - 15 // Some variation in angle
        });
      }
    }
    
    // Add water
    if (layout.water && layout.water.count > 0) {
      for (let i = 0; i < layout.water.count; i++) {
        const size = Math.floor(
          Math.random() * (layout.water.size.max - layout.water.size.min) + layout.water.size.min
        );
        newElements.push({
          type: ELEMENT_TYPES.WATER,
          x: Math.random() * (width - size),
          y: Math.random() * (height - size / 2),
          size,
          rotation: Math.random() * 360
        });
      }
    }
    
    return newElements;
  };
  
  // Handle resize and responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (gardenRef.current) {
        const { offsetWidth } = gardenRef.current;
        const height = Math.max(300, offsetWidth * 0.75); // Maintain aspect ratio
        setGardenSize({ width: offsetWidth, height });
      }
    };
    
    // Initial size
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Generate new elements when streak or garden size changes
  useEffect(() => {
    const layout = getLayoutForStreak(streak);
    setElements(generateElements(layout, gardenSize.width, gardenSize.height));
  }, [streak, gardenSize]);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md">
      <div 
        ref={gardenRef}
        className={`relative w-full ${isDarkMode ? 'bg-gray-900' : 'bg-green-50'} overflow-hidden transition-colors duration-500`}
        style={{ height: `${gardenSize.height}px` }}
      >
        {/* Sand pattern */}
        <div 
          className={`absolute inset-0 ${isDarkMode ? 'opacity-10' : 'opacity-30'}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h40v40H40V0zm-40 40h40v40H0V40z' fill='%23${isDarkMode ? '888888' : '888888'}' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        />

        {/* Render all elements */}
        {elements.map((element, index) => {
          switch (element.type) {
            case ELEMENT_TYPES.ROCK:
              return <RockElement key={index} element={element} isDarkMode={isDarkMode} />;
            case ELEMENT_TYPES.RAKE:
              return <RakeElement key={index} element={element} isDarkMode={isDarkMode} />;
            case ELEMENT_TYPES.LANTERN:
              return <LanternElement key={index} element={element} isDarkMode={isDarkMode} />;
            case ELEMENT_TYPES.BRIDGE:
              return <BridgeElement key={index} element={element} isDarkMode={isDarkMode} />;
            case ELEMENT_TYPES.WATER:
              return <WaterElement key={index} element={element} isDarkMode={isDarkMode} />;
            default:
              return null;
          }
        })}
        
        {/* Meditation streak indicator */}
        <div className="absolute bottom-3 right-3 bg-white bg-opacity-80 rounded-full px-3 py-1 text-sm font-semibold shadow-md">
          {streak} day{streak !== 1 ? 's' : ''} 🧘
        </div>
      </div>
    </div>
  );
};

// Rock Element
function RockElement({ element, isDarkMode }) {
  return (
    <div
      className="absolute rounded-full transition-colors duration-500"
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.size}px`,
        height: `${element.size}px`,
        backgroundColor: isDarkMode ? '#374151' : '#a3a3a3',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        transform: `rotate(${element.rotation}deg)`,
        zIndex: Math.floor(element.y)
      }}
    />
  );
}

// Rake Element
function RakeElement({ element, isDarkMode }) {
  return (
    <div
      className="absolute transition-colors duration-500"
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: Math.floor(element.y)
      }}
    >
      {/* Handle */}
      <div className="w-1 h-10 mx-auto transition-colors duration-500" 
        style={{ backgroundColor: isDarkMode ? '#9ca3af' : '#374151' }} 
      />
      
      {/* Rake head */}
      <div className="w-8 h-1 mt-1 transition-colors duration-500" 
        style={{ backgroundColor: isDarkMode ? '#9ca3af' : '#374151' }} 
      />
      
      {/* Sand pattern */}
      <div className="relative">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className={`absolute w-12 h-0.5 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} transition-colors duration-500`}
            style={{ 
              top: `${i * 5 + 5}px`, 
              left: '-8px',
              opacity: 0.7
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Lantern Element
function LanternElement({ element, isDarkMode }) {
  return (
    <div
      className="absolute flex flex-col items-center transition-colors duration-500"
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: Math.floor(element.y)
      }}
    >
      {/* Top */}
      <div className={`w-4 h-1 rounded-t-md transition-colors duration-500 ${isDarkMode ? 'bg-yellow-700' : 'bg-yellow-600'}`} />
      
      {/* Lantern body with glow effect */}
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500 ${
          isDarkMode ? 'bg-yellow-800' : 'bg-yellow-300'
        } animate-glow`}
        style={{
          boxShadow: isDarkMode
            ? '0 0 8px rgba(255, 204, 0, 0.6)'
            : '0 0 8px rgba(255, 255, 0, 0.5)'
        }}
      >
        <div className="w-1 h-1 rounded-full bg-white opacity-50" />
      </div>
      
      {/* Base */}
      <div className={`w-3 h-1 rounded-b-sm transition-colors duration-500 ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-700'}`} />
    </div>
  );
}

// Bridge Element
function BridgeElement({ element, isDarkMode }) {
  return (
    <div
      className="absolute transition-colors duration-500"
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        zIndex: Math.floor(element.y),
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))'
      }}
    >
      <div 
        className="relative"
        style={{
          transform: `rotate(${element.rotation}deg)`,
          width: `${element.size}px`,
          height: `${element.size * 0.4}px`
        }}
      >
        {/* Bridge arch */}
        <div 
          className={`w-full h-full rounded-t-full transition-colors duration-500 ${
            isDarkMode ? 'bg-amber-950' : 'bg-amber-800'
          }`}
          style={{ 
            borderBottomLeftRadius: '0',
            borderBottomRightRadius: '0',
            backgroundImage: isDarkMode ? 
              'linear-gradient(to bottom, #78350f, #451a03)' : 
              'linear-gradient(to bottom, #f59e0b, #b45309)'
          }}
        />
        
        {/* Plank lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className={`w-full h-0.5 transition-colors duration-500 ${
                isDarkMode ? 'bg-yellow-900' : 'bg-yellow-600'
              }`}
              style={{ opacity: 0.4 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Water Element
function WaterElement({ element, isDarkMode }) {
  return (
    <div
      className="absolute rounded-full opacity-70 transition-colors duration-500 animate-water-ripple"
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.size}px`,
        height: `${element.size * 0.6}px`,
        backgroundColor: isDarkMode ? '#2563eb' : '#3b82f6',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)',
        transform: `rotate(${element.rotation}deg)`,
        zIndex: Math.floor(element.y)
      }}
    />
  );
}

export default ZenGarden; 