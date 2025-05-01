import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Garden elements configuration based on streak levels
const GARDEN_LEVELS = [
  { level: 'low', minStreak: 0, maxStreak: 2, description: 'Starting your journey' },
  { level: 'medium', minStreak: 3, maxStreak: 6, description: 'Building consistency' },
  { level: 'high', minStreak: 7, maxStreak: Infinity, description: 'Creating a flourishing practice' }
];

// Garden elements for each level
const GARDEN_ELEMENTS = {
  low: [
    { type: 'tree', variant: 'basic', count: 2 },
    { type: 'rock', variant: 'small', count: 3 },
    { type: 'lantern', variant: 'simple', count: 1 }
  ],
  medium: [
    { type: 'tree', variant: 'cherry', count: 6 },
    { type: 'path', variant: 'stone', count: 1 },
    { type: 'bush', variant: 'small', count: 4 },
    { type: 'lantern', variant: 'stone', count: 2 },
    { type: 'animation', variant: 'petals', count: 1 }
  ],
  high: [
    { type: 'tree', variant: 'cherry', count: 5 },
    { type: 'tree', variant: 'maple', count: 4 },
    { type: 'tree', variant: 'candy', count: 3 },
    { type: 'flower', variant: 'mixed', count: 8 },
    { type: 'lantern', variant: 'ornate', count: 4 },
    { type: 'water', variant: 'stream', count: 1 },
    { type: 'decoration', variant: 'rocks', count: 5 },
    { type: 'animation', variant: 'petals', count: 1 },
    { type: 'animation', variant: 'birds', count: 1 },
    { type: 'animation', variant: 'water', count: 1 }
  ]
};

// Grid configuration
const GRID_SIZE = 5; // 5x5 grid

const Garden3D = ({ streak = 0 }) => {
  const [gardenLevel, setGardenLevel] = useState('low');
  const [gardenElements, setGardenElements] = useState([]);
  const [gridItems, setGridItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [viewMode, setViewMode] = useState('day');
  const [rotation, setRotation] = useState(0);
  const [tilt, setTilt] = useState(30); // Default isometric view
  const animationFrameRef = useRef(null);

  // Determine garden level based on streak
  useEffect(() => {
    const determineGardenLevel = () => {
      for (const level of GARDEN_LEVELS) {
        if (streak >= level.minStreak && streak <= level.maxStreak) {
          return level.level;
        }
      }
      return 'low'; // Default
    };

    const level = determineGardenLevel();
    setGardenLevel(level);
    
    // When level changes, animate transition
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1500);
    
    return () => clearTimeout(timer);
  }, [streak]);

  // Generate garden elements based on level
  useEffect(() => {
    if (gardenLevel) {
      const elements = GARDEN_ELEMENTS[gardenLevel];
      setGardenElements(elements);
      generateGardenGrid(elements);
    }
  }, [gardenLevel]);

  // Generate grid items with placed elements
  const generateGardenGrid = (elements) => {
    // Create empty grid first
    const grid = Array.from({ length: GRID_SIZE * GRID_SIZE }, () => ({
      occupied: false,
      element: null,
      variant: null,
      decorations: []
    }));
    
    // Place elements in grid
    elements.forEach(element => {
      const { type, variant, count } = element;
      
      for (let i = 0; i < count; i++) {
        // Find random unoccupied position
        let attempts = 0;
        let placed = false;
        
        while (!placed && attempts < 20) {
          const position = Math.floor(Math.random() * grid.length);
          
          if (!grid[position].occupied) {
            grid[position] = {
              occupied: true,
              element: type,
              variant: variant,
              decorations: []
            };
            placed = true;
          }
          
          attempts++;
        }
      }
    });
    
    setGridItems(grid);
  };

  // Start animation loop for falling petals, flowing water, etc.
  useEffect(() => {
    let lastTime = 0;
    const particles = [];
    
    // Create initial particles based on animations
    if (gardenElements.some(el => el.type === 'animation')) {
      const animations = gardenElements.filter(el => el.type === 'animation');
      
      animations.forEach(animation => {
        if (animation.variant === 'petals') {
          // Add petal particles
          for (let i = 0; i < 30; i++) {
            particles.push({
              type: 'petal',
              x: Math.random() * 100,
              y: Math.random() * -100,
              z: Math.random() * 100,
              size: 3 + Math.random() * 5,
              speed: 0.5 + Math.random() * 1,
              rotation: Math.random() * 360,
              rotationSpeed: Math.random() * 2 - 1
            });
          }
        }
      });
    }
    
    // Animation loop
    const animate = (time) => {
      if (lastTime === 0) lastTime = time;
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Update particles
      particles.forEach(particle => {
        if (particle.type === 'petal') {
          particle.y += particle.speed * (deltaTime / 16);
          particle.x += Math.sin(time / 1000 + particle.z) * 0.2;
          particle.rotation += particle.rotationSpeed * (deltaTime / 16);
          
          // Reset if out of view
          if (particle.y > 100) {
            particle.y = Math.random() * -20;
            particle.x = Math.random() * 100;
          }
        }
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation if there are particles
    if (particles.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    
    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gardenElements]);

  // Rotate garden view
  const rotateGarden = (direction) => {
    setRotation(prev => {
      if (direction === 'left') {
        return (prev - 45 + 360) % 360;
      } else {
        return (prev + 45) % 360;
      }
    });
  };

  // Toggle between day/night view modes
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'day' ? 'night' : 'day');
  };

  // Render a specific grid item based on its contents
  const renderGridItem = (item, index) => {
    const { element, variant } = item;
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    
    // Calculate position in 3D space
    const xPos = col * 20 - (GRID_SIZE * 10) + 10;
    const zPos = row * 20 - (GRID_SIZE * 10) + 10;
    const yPos = 0; // Base height
    
    // Calculate isometric position
    const isoX = xPos - zPos;
    const isoY = (xPos + zPos) / 2;
    
    if (!element) {
      return (
        <div 
          key={index} 
          className="absolute w-20 h-20 transform-gpu transition-all duration-700 ease-in-out"
          style={{
            transform: `translate(${isoX}px, ${isoY}px) rotateX(${tilt}deg) rotateZ(${rotation}deg)`,
            zIndex: Math.floor(row * GRID_SIZE + col)
          }}
        >
          {/* Empty grid cell - just grass */}
          <div className="w-full h-full bg-green-200 rounded-sm border border-green-300 opacity-80"></div>
        </div>
      );
    }
    
    // Different element types
    switch (element) {
      case 'tree':
        return (
          <div 
            key={index} 
            className="absolute w-24 h-24 transform-gpu transition-all duration-700 ease-in-out"
            style={{
              transform: `translate(${isoX - 2}px, ${isoY - 30}px) rotateX(${tilt}deg) rotateZ(${rotation}deg)`,
              zIndex: 100 + Math.floor(row * GRID_SIZE + col)
            }}
          >
            {variant === 'cherry' && (
              <div className="relative">
                {/* Tree trunk */}
                <div className="absolute w-6 h-24 bg-amber-800 rounded-sm left-9 top-0"></div>
                {/* Tree foliage */}
                <div className="absolute w-24 h-20 bg-pink-300 rounded-full top-0 left-0 
                  animate-pulse-slow"></div>
                <div className="absolute w-20 h-16 bg-pink-200 rounded-full top-2 left-2"></div>
                {/* Falling petals animation */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-pink-200 animate-petal-fall"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100 + 20}%`,
                      opacity: 0.7,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${3 + Math.random() * 4}s`
                    }}
                  ></div>
                ))}
              </div>
            )}
            
            {variant === 'maple' && (
              <div className="relative">
                {/* Tree trunk */}
                <div className="absolute w-6 h-24 bg-amber-900 rounded-sm left-9 top-0"></div>
                {/* Tree foliage */}
                <div className="absolute w-24 h-20 bg-red-500 rounded-full top-0 left-0"></div>
                <div className="absolute w-20 h-16 bg-orange-500 rounded-full top-2 left-2"></div>
              </div>
            )}
            
            {variant === 'candy' && (
              <div className="relative">
                {/* Tree trunk */}
                <div className="absolute w-6 h-24 bg-amber-700 rounded-sm left-9 top-0"></div>
                {/* Tree foliage */}
                <div className="absolute w-24 h-24 bg-gradient-to-b from-pink-300 to-purple-300 rounded-full top-0 left-0"></div>
                {/* Candy decorations */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${Math.random() * 60}%`,
                      background: ['#F9A8D4', '#C4B5FD', '#93C5FD', '#A7F3D0'][Math.floor(Math.random() * 4)]
                    }}
                  ></div>
                ))}
              </div>
            )}
            
            {variant === 'basic' && (
              <div className="relative">
                {/* Tree trunk */}
                <div className="absolute w-4 h-18 bg-amber-800 rounded-sm left-10 top-6"></div>
                {/* Tree foliage */}
                <div className="absolute w-18 h-14 bg-green-600 rounded-full top-0 left-3"></div>
              </div>
            )}
          </div>
        );
        
      case 'rock':
        return (
          <div 
            key={index} 
            className="absolute w-12 h-8 transform-gpu transition-all duration-700 ease-in-out"
            style={{
              transform: `translate(${isoX + 4}px, ${isoY + 6}px) rotateX(${tilt}deg) rotateZ(${rotation}deg)`,
              zIndex: 10 + Math.floor(row * GRID_SIZE + col)
            }}
          >
            <div className="w-full h-full bg-gray-400 rounded-md"></div>
          </div>
        );
        
      case 'lantern':
        return (
          <div 
            key={index} 
            className="absolute w-8 h-16 transform-gpu transition-all duration-700 ease-in-out"
            style={{
              transform: `translate(${isoX + 6}px, ${isoY}px) rotateX(${tilt}deg) rotateZ(${rotation}deg)`,
              zIndex: 20 + Math.floor(row * GRID_SIZE + col)
            }}
          >
            <div className="relative">
              <div className="absolute w-8 h-8 bg-gray-300 rounded-md bottom-0 left-0"></div>
              <div className="absolute w-6 h-6 bg-yellow-100 rounded-md bottom-1 left-1 animate-glow"></div>
              <div className="absolute w-4 h-4 bg-red-800 rounded-t-md top-0 left-2"></div>
            </div>
          </div>
        );
        
      case 'path':
        return (
          <div 
            key={index} 
            className="absolute w-20 h-20 transform-gpu transition-all duration-700 ease-in-out"
            style={{
              transform: `translate(${isoX}px, ${isoY}px) rotateX(${tilt}deg) rotateZ(${rotation}deg)`,
              zIndex: Math.floor(row * GRID_SIZE + col)
            }}
          >
            <div className="w-full h-full bg-amber-200 rounded-sm flex items-center justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-3 h-3 bg-amber-300 rounded-full m-1"
                ></div>
              ))}
            </div>
          </div>
        );
        
      case 'flower':
        return (
          <div 
            key={index} 
            className="absolute w-12 h-12 transform-gpu transition-all duration-700 ease-in-out"
            style={{
              transform: `translate(${isoX + 4}px, ${isoY + 4}px) rotateX(${tilt}deg) rotateZ(${rotation}deg)`,
              zIndex: 15 + Math.floor(row * GRID_SIZE + col)
            }}
          >
            <div className="relative">
              <div className="absolute w-2 h-8 bg-green-600 left-5 bottom-0"></div>
              <div className="absolute w-10 h-10 rounded-full top-0 left-1"
                style={{
                  background: ['#F9A8D4', '#FBCFE8', '#DDD6FE', '#C4B5FD', '#93C5FD', '#A7F3D0'][Math.floor(Math.random() * 6)]
                }}
              ></div>
              <div className="absolute w-4 h-4 rounded-full bg-yellow-300 top-3 left-4"></div>
            </div>
          </div>
        );
        
      case 'water':
        return (
          <div 
            key={index} 
            className="absolute w-20 h-20 transform-gpu transition-all duration-700 ease-in-out"
            style={{
              transform: `translate(${isoX}px, ${isoY}px) rotateX(${tilt}deg) rotateZ(${rotation}deg)`,
              zIndex: Math.floor(row * GRID_SIZE + col)
            }}
          >
            <div className="w-full h-full bg-blue-300 rounded-sm">
              <div className="w-full h-full bg-gradient-to-r from-blue-200 to-blue-400 animate-water-flow"></div>
            </div>
          </div>
        );
        
      default:
        return (
          <div 
            key={index} 
            className="absolute w-20 h-20 transform-gpu transition-all duration-700 ease-in-out"
            style={{
              transform: `translate(${isoX}px, ${isoY}px) rotateX(${tilt}deg) rotateZ(${rotation}deg)`,
              zIndex: Math.floor(row * GRID_SIZE + col)
            }}
          >
            <div className="w-full h-full bg-green-300 rounded-sm"></div>
          </div>
        );
    }
  };

  return (
    <div className={`bg-gradient-to-b ${viewMode === 'day' ? 'from-blue-200 to-sky-400' : 'from-indigo-900 to-purple-900'} rounded-lg p-6 relative overflow-hidden transition-colors duration-1000`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-xl font-bold ${viewMode === 'day' ? 'text-gray-800' : 'text-gray-100'}`}>
            Your Meditation Garden
          </h2>
          <p className={`${viewMode === 'day' ? 'text-gray-600' : 'text-gray-300'}`}>
            {streak} day{streak !== 1 ? 's' : ''} streak • {GARDEN_LEVELS.find(l => l.level === gardenLevel)?.description}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={toggleViewMode}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600"
          >
            {viewMode === 'day' ? '🌙' : '☀️'}
          </button>
          <button
            onClick={() => rotateGarden('left')}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600"
          >
            ↺
          </button>
          <button
            onClick={() => rotateGarden('right')}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600"
          >
            ↻
          </button>
        </div>
      </div>
      
      <div className="relative h-[500px] overflow-hidden">
        {/* 3D Garden Visualization */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isAnimating ? 'scale-105 opacity-90' : 'scale-100 opacity-100'}`}>
          {/* Garden Base */}
          <div className="relative w-[300px] h-[300px]">
            {/* Isometric Base */}
            <div
              className="absolute w-[300px] h-[300px] bg-gradient-to-br from-green-300 to-green-400 transition-all duration-700"
              style={{
                transform: `rotateX(${tilt}deg) rotateZ(${rotation}deg)`,
                transformStyle: 'preserve-3d',
                borderRadius: '4px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}
            >
              {/* Ground texture */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-green-400 opacity-80"></div>
              
              {/* Soil/Earth sides */}
              <div 
                className="absolute w-[300px] h-[30px] bg-gradient-to-b from-amber-700 to-amber-900"
                style={{
                  transform: 'rotateX(90deg) translateZ(15px) translateY(-15px)',
                  bottom: '-15px',
                  transformOrigin: 'bottom',
                  borderRadius: '0 0 4px 4px'
                }}
              ></div>
            </div>
            
            {/* Garden Elements */}
            {gridItems.map((item, index) => renderGridItem(item, index))}
            
            {/* Ambient particles */}
            {gardenLevel === 'medium' || gardenLevel === 'high' ? (
              Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className="absolute rounded-full bg-white opacity-60 animate-float"
                  style={{
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${5 + Math.random() * 10}s`
                  }}
                ></div>
              ))
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Garden3D; 