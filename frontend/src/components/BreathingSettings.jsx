import { useState } from 'react';

const BreathingSettings = ({ onSave, defaultInhale = 4, defaultExhale = 6 }) => {
  const [inhaleDuration, setInhaleDuration] = useState(defaultInhale);
  const [exhaleDuration, setExhaleDuration] = useState(defaultExhale);

  const handleSave = () => {
    onSave({ inhaleDuration, exhaleDuration });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Breathing Settings</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="inhale-duration">
            Inhale Duration: {inhaleDuration} seconds
          </label>
          <input
            id="inhale-duration"
            type="range"
            min="2"
            max="10"
            step="1"
            value={inhaleDuration}
            onChange={(e) => setInhaleDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>2s</span>
            <span>10s</span>
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="exhale-duration">
            Exhale Duration: {exhaleDuration} seconds
          </label>
          <input
            id="exhale-duration"
            type="range"
            min="2"
            max="10"
            step="1"
            value={exhaleDuration}
            onChange={(e) => setExhaleDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>2s</span>
            <span>10s</span>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          <p>Recommended ratio: Exhale slightly longer than inhale (approximately 1:1.5).</p>
        </div>
        
        <button
          onClick={handleSave}
          className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition duration-150"
        >
          Apply Settings
        </button>
      </div>
    </div>
  );
};

export default BreathingSettings; 