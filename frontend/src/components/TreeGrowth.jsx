import { useState, useEffect } from 'react';
import axios from 'axios';

const GROWTH_STAGES = [
  { name: 'seed', sessionsNeeded: 0 },
  { name: 'sprout', sessionsNeeded: 3 },
  { name: 'sapling', sessionsNeeded: 7 },
  { name: 'young-tree', sessionsNeeded: 14 },
  { name: 'mature-tree', sessionsNeeded: 30 },
  { name: 'blossoming-tree', sessionsNeeded: 60 }
];

const DECORATIONS = [
  { id: 'birds', name: 'Birds', unlockAt: 7, description: 'Colorful birds perched on branches' },
  { id: 'blossoms', name: 'Blossoms', unlockAt: 14, description: 'Beautiful pink blossoms on branches' },
  { id: 'sunrays', name: 'Sun Rays', unlockAt: 21, description: 'Golden rays of sunlight' },
  { id: 'butterflies', name: 'Butterflies', unlockAt: 30, description: 'Delicate butterflies flutter around' },
  { id: 'snow', name: 'Snow', unlockAt: 45, description: 'Gentle snowfall on your tree' }
];

const TreeGrowth = () => {
  const [sessionCount, setSessionCount] = useState(0);
  const [currentStage, setCurrentStage] = useState(GROWTH_STAGES[0]);
  const [unlockedDecorations, setUnlockedDecorations] = useState([]);
  const [activeDecorations, setActiveDecorations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDecorationPanel, setShowDecorationPanel] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Simulate fetching user data - in real app would come from API
  useEffect(() => {
    const fetchUserMeditationData = async () => {
      try {
        setLoading(true);
        // Simulated API call
        // const backendPort = localStorage.getItem('backendPort') || '5001';
        // const response = await axios.get(`http://localhost:${backendPort}/api/user/meditation-stats`);
        // const { sessionCount } = response.data;
        
        // For demo, use random session count
        const demoSessionCount = Math.floor(Math.random() * 50) + 1;
        setSessionCount(demoSessionCount);
        
        // Calculate which decorations are unlocked
        const unlocked = DECORATIONS.filter(d => demoSessionCount >= d.unlockAt);
        setUnlockedDecorations(unlocked);
        
        // By default, show first three unlocked decorations
        setActiveDecorations(unlocked.slice(0, 3).map(d => d.id));
        
        // Update tree growth stage
        const newStage = determineGrowthStage(demoSessionCount);
        setCurrentStage(newStage);
      } catch (error) {
        console.error('Error fetching meditation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMeditationData();
  }, []);
  
  // Determine tree growth stage based on session count
  const determineGrowthStage = (sessions) => {
    // Find the highest stage the user has achieved
    for (let i = GROWTH_STAGES.length - 1; i >= 0; i--) {
      if (sessions >= GROWTH_STAGES[i].sessionsNeeded) {
        return GROWTH_STAGES[i];
      }
    }
    return GROWTH_STAGES[0]; // Default to seed
  };
  
  // Calculate progress to next stage
  const calculateNextStageProgress = () => {
    const currentIndex = GROWTH_STAGES.findIndex(stage => stage.name === currentStage.name);
    if (currentIndex === GROWTH_STAGES.length - 1) {
      // Already at max stage
      return 100;
    }
    
    const nextStage = GROWTH_STAGES[currentIndex + 1];
    const sessionsForCurrentStage = currentStage.sessionsNeeded;
    const sessionsForNextStage = nextStage.sessionsNeeded;
    const sessionsNeeded = sessionsForNextStage - sessionsForCurrentStage;
    const progress = (sessionCount - sessionsForCurrentStage) / sessionsNeeded * 100;
    
    return Math.min(Math.max(progress, 0), 100);
  };
  
  // Toggle decoration on/off
  const toggleDecoration = (decorationId) => {
    setActiveDecorations(prev => {
      if (prev.includes(decorationId)) {
        return prev.filter(id => id !== decorationId);
      } else {
        return [...prev, decorationId];
      }
    });
  };
  
  // Rotate tree view
  const rotateTree = (direction) => {
    setRotation(prev => {
      if (direction === 'left') {
        return prev - 45;
      } else {
        return prev + 45;
      }
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // Calculate next stage
  const nextStageIndex = GROWTH_STAGES.findIndex(stage => stage.name === currentStage.name) + 1;
  const nextStage = nextStageIndex < GROWTH_STAGES.length ? GROWTH_STAGES[nextStageIndex] : null;
  const nextStageProgress = calculateNextStageProgress();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Meditation Tree</h2>
        <p className="text-gray-600 mt-2">
          Watch your tree grow as you develop your meditation practice
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Tree Visualization */}
        <div className="flex-1 relative min-h-[400px] border rounded-lg bg-gradient-to-b from-blue-50 to-green-50 overflow-hidden">
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-700"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* Tree rendering based on growth stage */}
            <div className="relative">
              {/* Base Tree */}
              <div className={`tree tree-${currentStage.name}`}>
                {currentStage.name === 'seed' && (
                  <div className="w-16 h-16 bg-brown-600 rounded-full mx-auto transform translate-y-16"></div>
                )}
                
                {currentStage.name === 'sprout' && (
                  <>
                    <div className="w-4 h-32 bg-green-700 mx-auto"></div>
                    <div className="w-24 h-12 bg-green-500 rounded-full mx-auto -mt-10"></div>
                  </>
                )}
                
                {currentStage.name === 'sapling' && (
                  <>
                    <div className="w-8 h-64 bg-brown-600 mx-auto"></div>
                    <div className="w-48 h-32 bg-green-500 rounded-full mx-auto -mt-16"></div>
                  </>
                )}
                
                {currentStage.name === 'young-tree' && (
                  <>
                    <div className="w-12 h-80 bg-brown-700 mx-auto"></div>
                    <div className="w-64 h-48 bg-green-600 rounded-full mx-auto -mt-24"></div>
                    <div className="w-48 h-32 bg-green-500 rounded-full mx-auto -mt-48 ml-12"></div>
                  </>
                )}
                
                {currentStage.name === 'mature-tree' && (
                  <>
                    <div className="w-16 h-96 bg-brown-800 mx-auto"></div>
                    <div className="w-80 h-64 bg-green-700 rounded-full mx-auto -mt-32"></div>
                    <div className="w-64 h-48 bg-green-600 rounded-full mx-auto -mt-64 ml-16"></div>
                    <div className="w-56 h-40 bg-green-500 rounded-full mx-auto -mt-80 -ml-16"></div>
                  </>
                )}
                
                {currentStage.name === 'blossoming-tree' && (
                  <>
                    <div className="w-20 h-96 bg-brown-900 mx-auto"></div>
                    <div className="w-96 h-80 bg-green-800 rounded-full mx-auto -mt-48"></div>
                    <div className="w-80 h-64 bg-green-700 rounded-full mx-auto -mt-96 ml-24"></div>
                    <div className="w-72 h-56 bg-green-600 rounded-full mx-auto -mt-112 -ml-24"></div>
                    <div className="w-64 h-48 bg-green-500 rounded-full mx-auto -mt-128 ml-8"></div>
                    
                    {/* Pink blossoms sprinkled throughout */}
                    <div className="absolute top-24 left-24 w-8 h-8 bg-pink-300 rounded-full opacity-80"></div>
                    <div className="absolute top-16 right-32 w-6 h-6 bg-pink-300 rounded-full opacity-80"></div>
                    <div className="absolute top-40 right-16 w-7 h-7 bg-pink-300 rounded-full opacity-80"></div>
                    <div className="absolute top-48 left-16 w-5 h-5 bg-pink-300 rounded-full opacity-80"></div>
                  </>
                )}
              </div>
              
              {/* Decorations */}
              {activeDecorations.includes('birds') && (
                <>
                  <div className="absolute top-24 right-16 w-8 h-6 bg-yellow-500 rounded-full"></div>
                  <div className="absolute top-32 left-24 w-6 h-5 bg-blue-500 rounded-full"></div>
                </>
              )}
              
              {activeDecorations.includes('blossoms') && (
                <>
                  <div className="absolute top-16 left-32 w-4 h-4 bg-pink-300 rounded-full animate-pulse"></div>
                  <div className="absolute top-24 right-24 w-3 h-3 bg-pink-300 rounded-full animate-pulse"></div>
                  <div className="absolute top-36 left-16 w-5 h-5 bg-pink-300 rounded-full animate-pulse"></div>
                </>
              )}
              
              {activeDecorations.includes('sunrays') && (
                <div className="absolute -top-12 left-0 right-0 w-full h-24 bg-gradient-to-b from-yellow-200 to-transparent opacity-60"></div>
              )}
              
              {activeDecorations.includes('butterflies') && (
                <>
                  <div className="absolute top-20 left-16 w-4 h-4 bg-purple-300 rounded-sm animate-bounce"></div>
                  <div className="absolute top-32 right-20 w-3 h-3 bg-orange-300 rounded-sm animate-bounce"></div>
                </>
              )}
              
              {activeDecorations.includes('snow') && (
                <div className="absolute inset-0 bg-white bg-opacity-30 bg-pattern-snow"></div>
              )}
            </div>
          </div>
          
          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button 
              onClick={() => rotateTree('left')}
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={() => rotateTree('right')}
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Stats and Decorations Panel */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Meditation Progress</h3>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Sessions completed: {sessionCount}</span>
              <span>Current stage: {currentStage.name.replace('-', ' ')}</span>
            </div>
            
            {nextStage && (
              <>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-1">
                  <div 
                    className="bg-primary-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${nextStageProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {Math.ceil(nextStage.sessionsNeeded - sessionCount)} more sessions until {nextStage.name.replace('-', ' ')}
                </div>
              </>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Your Decorations</h3>
              <button
                onClick={() => setShowDecorationPanel(!showDecorationPanel)}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                {showDecorationPanel ? 'Hide Panel' : 'Show Panel'}
              </button>
            </div>
            
            {showDecorationPanel ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-4">
                  Toggle decorations to customize your tree
                </p>
                
                <div className="space-y-3">
                  {DECORATIONS.map(decoration => {
                    const isUnlocked = unlockedDecorations.find(d => d.id === decoration.id);
                    const isActive = activeDecorations.includes(decoration.id);
                    
                    return (
                      <div 
                        key={decoration.id}
                        className={`p-3 rounded-md border ${isUnlocked ? 'border-gray-200' : 'border-gray-100 bg-gray-100'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`font-medium ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                              {decoration.name}
                            </h4>
                            <p className={`text-xs ${isUnlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                              {isUnlocked ? decoration.description : `Unlocks after ${decoration.unlockAt} sessions`}
                            </p>
                          </div>
                          
                          {isUnlocked && (
                            <button
                              onClick={() => toggleDecoration(decoration.id)}
                              className={`w-10 h-6 rounded-full p-1 transition-colors ${
                                isActive ? 'bg-primary-500' : 'bg-gray-300'
                              }`}
                            >
                              <div 
                                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                  isActive ? 'transform translate-x-4' : ''
                                }`}
                              ></div>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-center text-sm text-gray-600">
                You've unlocked {unlockedDecorations.length} of {DECORATIONS.length} decorations!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeGrowth; 