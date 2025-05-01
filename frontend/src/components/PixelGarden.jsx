import { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

// Garden configuration based on meditation streak
const GARDEN_LEVELS = [
  { level: 'beginner', minStreak: 0, maxStreak: 2, description: 'Starting your journey' },
  { level: 'growing', minStreak: 3, maxStreak: 6, description: 'Building consistency' }, 
  { level: 'flourishing', minStreak: 7, maxStreak: Infinity, description: 'Creating a flourishing practice' }
];

// Pixel art assets for each garden element
const GARDEN_ASSETS = {
  ground: {
    beginner: '🟩', // Basic grass
    growing: '🌱', // Grass with some sprouts
    flourishing: '🌿' // Lush grass
  },
  trees: {
    beginner: ['🌲', '🌳'],
    growing: ['🌸', '🌳', '🌲'],
    flourishing: ['🌸', '🌳', '🌲', '🍎', '🎋']
  },
  decorations: {
    beginner: ['🪨', '🧱'],
    growing: ['🪨', '🧱', '🏮', '🛖'],
    flourishing: ['🪨', '🏮', '⛩️', '🪷', '🎍', '🏯'] 
  },
  water: {
    beginner: null,
    growing: '💧',
    flourishing: '🌊'
  },
  flowers: {
    beginner: ['🌼'],
    growing: ['🌼', '🌻', '🌷'],
    flourishing: ['🌼', '🌻', '🌷', '🌹', '🪷', '🌺']
  },
  animals: {
    beginner: null,
    growing: ['🐿️'],
    flourishing: ['🐿️', '🦊', '🐇', '🦢']
  }
};

// Grid dimensions
const GRID_WIDTH = 8;
const GRID_HEIGHT = 8;

const PixelGarden = ({ streak = 0 }) => {
  const [gardenLevel, setGardenLevel] = useState('beginner');
  const [grid, setGrid] = useState([]);
  const [tileSize, setTileSize] = useState(40);
  const [viewMode, setViewMode] = useState('day');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationFrameRef = useRef(null);
  const gardenRef = useRef(null);
  
  // Animation spring for elements
  const animProps = useSpring({
    scale: isAnimating ? 1.1 : 1,
    opacity: isAnimating ? 0.8 : 1,
    config: { tension: 300, friction: 10 },
    onRest: () => setIsAnimating(false)
  });

  // Determine garden level based on streak
  useEffect(() => {
    const level = GARDEN_LEVELS.find(
      l => streak >= l.minStreak && streak <= l.maxStreak
    )?.level || 'beginner';
    
    setGardenLevel(level);
    setIsAnimating(true);
    
    // Trigger generate garden after level change
    generateGarden(level);
  }, [streak]);

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (gardenRef.current) {
        const containerWidth = gardenRef.current.offsetWidth;
        const newTileSize = Math.min(
          Math.floor(containerWidth / GRID_WIDTH) - 2,
          60 // Maximum tile size
        );
        setTileSize(Math.max(newTileSize, 30)); // Minimum tile size
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate the garden grid based on level
  const generateGarden = (level) => {
    const newGrid = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(null));
    
    // Start with ground tiles
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        newGrid[y][x] = { type: 'ground', content: GARDEN_ASSETS.ground[level] };
      }
    }
    
    // Place water (for growing and flourishing levels)
    if (level !== 'beginner' && GARDEN_ASSETS.water[level]) {
      const waterPositions = [];
      
      // Create a small pond or stream
      if (level === 'growing') {
        // Single small pond
        const centerX = Math.floor(GRID_WIDTH / 2);
        const centerY = Math.floor(GRID_HEIGHT / 2);
        waterPositions.push({ x: centerX, y: centerY });
      } else if (level === 'flourishing') {
        // Stream that winds through the garden
        let streamX = Math.floor(GRID_WIDTH / 3);
        for (let y = 0; y < GRID_HEIGHT; y += 2) {
          waterPositions.push({ x: streamX, y: y });
          // Occasionally shift the stream
          if (Math.random() > 0.5 && streamX < GRID_WIDTH - 2) {
            streamX += 1;
            waterPositions.push({ x: streamX, y: y + 1 });
          } else if (Math.random() > 0.5 && streamX > 1) {
            streamX -= 1;
            waterPositions.push({ x: streamX, y: y + 1 });
          } else {
            waterPositions.push({ x: streamX, y: y + 1 });
          }
        }
      }
      
      // Apply water to grid
      waterPositions.forEach(pos => {
        if (pos.x >= 0 && pos.x < GRID_WIDTH && pos.y >= 0 && pos.y < GRID_HEIGHT) {
          newGrid[pos.y][pos.x] = { type: 'water', content: GARDEN_ASSETS.water[level] };
        }
      });
    }
    
    // Place trees
    const treesToPlace = {
      beginner: 2,
      growing: 5,
      flourishing: 8
    }[level];
    
    placeRandomElements(
      newGrid, 
      'tree', 
      GARDEN_ASSETS.trees[level], 
      treesToPlace, 
      (x, y, grid) => grid[y][x].type === 'ground'
    );
    
    // Place decorations
    const decorationsToPlace = {
      beginner: 2,
      growing: 4, 
      flourishing: 7
    }[level];
    
    placeRandomElements(
      newGrid,
      'decoration',
      GARDEN_ASSETS.decorations[level],
      decorationsToPlace,
      (x, y, grid) => grid[y][x].type === 'ground'
    );
    
    // Place flowers
    const flowersToPlace = {
      beginner: 3,
      growing: 6,
      flourishing: 10
    }[level];
    
    placeRandomElements(
      newGrid,
      'flower',
      GARDEN_ASSETS.flowers[level],
      flowersToPlace,
      (x, y, grid) => grid[y][x].type === 'ground'
    );
    
    // Place animals (if available for the level)
    if (GARDEN_ASSETS.animals[level]) {
      const animalsToPlace = {
        beginner: 0,
        growing: 1,
        flourishing: 3
      }[level];
      
      placeRandomElements(
        newGrid,
        'animal',
        GARDEN_ASSETS.animals[level],
        animalsToPlace,
        (x, y, grid) => grid[y][x].type === 'ground'
      );
    }
    
    setGrid(newGrid);
  };
  
  // Helper to place elements randomly on the grid
  const placeRandomElements = (grid, type, possibleContents, count, validationFn) => {
    let placed = 0;
    let attempts = 0;
    const maxAttempts = 50;
    
    while (placed < count && attempts < maxAttempts) {
      const x = Math.floor(Math.random() * GRID_WIDTH);
      const y = Math.floor(Math.random() * GRID_HEIGHT);
      
      if (validationFn(x, y, grid)) {
        // Get random content from possible options
        const content = possibleContents[Math.floor(Math.random() * possibleContents.length)];
        grid[y][x] = { type, content };
        placed++;
      }
      
      attempts++;
    }
  };
  
  // Start particle animation for flourishing garden
  useEffect(() => {
    if (gardenLevel === 'flourishing') {
      let lastFrameTime = 0;
      const particles = [];
      
      // Create initial particles
      for (let i = 0; i < 15; i++) {
        particles.push({
          type: Math.random() > 0.5 ? 'petal' : 'light',
          x: Math.random() * 100,
          y: Math.random() * -30,
          vx: Math.random() * 2 - 1,
          vy: 0.5 + Math.random() * 0.5,
          size: 10 + Math.random() * 10,
          content: ['🌸', '✨', '🦋', '🍃'][Math.floor(Math.random() * 4)],
          opacity: 0.7 + Math.random() * 0.3,
          rotation: Math.random() * 360
        });
      }
      
      // Animation loop
      const animate = (time) => {
        if (!lastFrameTime) lastFrameTime = time;
        const deltaTime = time - lastFrameTime;
        lastFrameTime = time;
        
        // Update particles
        particles.forEach(particle => {
          particle.y += particle.vy * (deltaTime / 20);
          particle.x += particle.vx * (deltaTime / 20);
          particle.rotation += deltaTime / 50;
          
          // Reset if out of view
          if (particle.y > 100) {
            particle.y = Math.random() * -20;
            particle.x = Math.random() * 100;
            particle.opacity = 0.7 + Math.random() * 0.3;
          }
        });
        
        // Update animation state to cause re-render
        setAnimationProgress(prev => (prev + 0.01) % 1);
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [gardenLevel]);
  
  // Toggle between day and night view modes
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'day' ? 'night' : 'day');
    setIsAnimating(true);
  };
  
  // Determine background gradient based on view mode
  const getBackgroundStyle = () => {
    if (viewMode === 'day') {
      return 'from-blue-200 to-sky-300';
    } else {
      return 'from-indigo-900 to-purple-900';
    }
  };
  
  // Tile appearance based on type, level, and view mode
  const getTileStyle = (tile) => {
    if (!tile) return {};
    
    const baseStyle = {
      width: `${tileSize}px`,
      height: `${tileSize}px`,
      fontSize: `${tileSize * 0.8}px`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
    
    switch (tile.type) {
      case 'ground':
        return {
          ...baseStyle,
          filter: viewMode === 'night' ? 'brightness(0.7)' : 'none',
        };
      case 'water':
        return {
          ...baseStyle,
          animation: 'water-ripple 3s ease-in-out infinite',
          filter: viewMode === 'night' ? 'brightness(0.8) saturate(0.7)' : 'none',
        };
      case 'tree':
      case 'flower':
      case 'decoration':
      case 'animal':
        return {
          ...baseStyle,
          filter: viewMode === 'night' ? 'brightness(0.8)' : 'none',
          textShadow: viewMode === 'night' ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
        };
      default:
        return baseStyle;
    }
  };

  // Render a single grid tile
  const renderTile = (tile, x, y) => {
    if (!tile) return null;
    
    const style = getTileStyle(tile);
    
    // Apply different animations based on tile type
    let animationClass = '';
    if (tile.type === 'flower') {
      animationClass = 'animate-pulse-slow';
    } else if (tile.type === 'animal') {
      animationClass = 'hover:animate-bounce';
    } else if (tile.type === 'water') {
      animationClass = 'animate-water-flow';
    }
    
    return (
      <div 
        key={`tile-${x}-${y}`}
        className={`relative transition-all duration-500 ${animationClass}`}
        style={style}
      >
        {tile.content}
      </div>
    );
  };
  
  // Render particles (petals, butterflies, etc) for flourishing garden
  const renderParticles = () => {
    if (gardenLevel !== 'flourishing') return null;
    
    // These particles are driven by the animation loop
    return Array.from({ length: 15 }).map((_, i) => (
      <div
        key={`particle-${i}`}
        className="absolute pointer-events-none"
        style={{
          left: `${Math.sin((i + animationProgress) * 0.5) * 40 + 50}%`,
          top: `${(((i * 7) + animationProgress * 100) % 100)}%`,
          fontSize: `${Math.max(12, Math.min(24, 15 + Math.sin(animationProgress * i) * 5))}px`,
          opacity: 0.5 + Math.sin(animationProgress * i) * 0.3,
          transform: `rotate(${i * 30 + animationProgress * 360}deg)`,
          transition: 'none'
        }}
      >
        {['🌸', '✨', '🦋', '🍃'][i % 4]}
      </div>
    ));
  };
  
  // Get emoji icon for streak level
  const getStreakIcon = () => {
    if (streak < 3) return '🌱';
    if (streak < 7) return '🌿';
    return '🌳';
  };

  return (
    <div 
      className={`rounded-xl bg-gradient-to-b ${getBackgroundStyle()} p-6 transition-colors duration-1000 overflow-hidden`}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className={`text-xl font-bold ${viewMode === 'day' ? 'text-gray-800' : 'text-white'}`}>
            Your Meditation Garden {getStreakIcon()}
          </h2>
          <p className={`${viewMode === 'day' ? 'text-gray-600' : 'text-gray-300'} transition-colors`}>
            {streak} day{streak !== 1 ? 's' : ''} streak • {GARDEN_LEVELS.find(l => l.level === gardenLevel)?.description}
          </p>
        </div>
        
        <button
          onClick={toggleViewMode}
          className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600 transition-all"
        >
          {viewMode === 'day' ? '🌙' : '☀️'}
        </button>
      </div>
      
      <animated.div 
        ref={gardenRef}
        style={animProps}
        className="relative mx-auto my-4 rounded-lg overflow-hidden"
      >
        {/* Garden Background */}
        <div 
          className={`w-full bg-gradient-to-b ${
            viewMode === 'day' 
              ? 'from-green-200 to-green-300' 
              : 'from-green-900 to-green-800'
          } transition-colors duration-500 rounded-lg shadow-inner p-2`}
          style={{ minHeight: `${GRID_HEIGHT * tileSize + 16}px` }}
        >
          {/* Garden Grid */}
          <div 
            className="grid gap-1 transition-all duration-500"
            style={{ 
              gridTemplateColumns: `repeat(${GRID_WIDTH}, ${tileSize}px)`,
              justifyContent: 'center'
            }}
          >
            {grid.map((row, y) => 
              row.map((tile, x) => renderTile(tile, x, y))
            )}
          </div>
          
          {/* Decorative Particles */}
          {renderParticles()}
          
          {/* Day/Night Overlay */}
          <div 
            className={`absolute inset-0 pointer-events-none ${
              viewMode === 'night' 
                ? 'bg-blue-900 opacity-20' 
                : 'bg-yellow-100 opacity-0'
            } transition-all duration-1000`}
          />
          
          {/* Streak Milestone Indicator */}
          {streak > 0 && (
            <div className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full px-3 py-1 text-sm font-bold shadow-md">
              {streak}🔥
            </div>
          )}
        </div>
      </animated.div>
      
      <div className={`text-center mt-4 ${viewMode === 'day' ? 'text-gray-700' : 'text-gray-300'}`}>
        <p className="text-sm italic">
          {gardenLevel === 'beginner' && "Nurture your practice to see your garden grow"}
          {gardenLevel === 'growing' && "Your consistent practice is bringing your garden to life"}
          {gardenLevel === 'flourishing' && "Your dedication has created a beautiful sanctuary"}
        </p>
      </div>
    </div>
  );
};

export default PixelGarden; 