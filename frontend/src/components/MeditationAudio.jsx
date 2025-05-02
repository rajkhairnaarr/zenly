import { useState, useEffect, useRef } from 'react';

// Import sample bell sound as base64 - small file (~10KB)
// This is a base64-encoded short bell sound

const MeditationAudio = ({ 
  isPlaying, 
  soundType = 'bells', 
  volume = 0.9,  // Increased to 90% volume
  onSoundComplete = () => {}
}) => {
  const audioRef = useRef(null);
  const [soundLoaded, setSoundLoaded] = useState(false);
  
  // Create audio sources
  const getAudioSource = (type) => {
    // Basic beep sound generated in browser
    if (type === 'bells') {
      return generateBeepSound(880, 1000); // A5 note for 1 second
    } else {
      return generateBeepSound(440, 500, true); // A4 note, looping
    }
  };
  
  // Function to generate a beep sound
  const generateBeepSound = (frequency = 440, duration = 500, loop = false) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.value = volume;
      
      oscillator.start();
      
      if (!loop) {
        setTimeout(() => {
          oscillator.stop();
          onSoundComplete();
        }, duration);
      }
      
      return { audioContext, oscillator, gainNode };
    } catch (e) {
      console.error('Error generating audio:', e);
      return null;
    }
  };
  
  // Set up sound when component mounts
  useEffect(() => {
    let audio = null;
    
    if (isPlaying) {
      audio = getAudioSource(soundType);
      console.log(`Playing ${soundType} sound at volume ${volume}`);
    }
    
    return () => {
      if (audio && audio.oscillator) {
        try {
          audio.oscillator.stop();
          audio.audioContext.close();
        } catch (e) {
          console.error('Error cleaning up audio:', e);
        }
      }
    };
  }, [isPlaying, soundType, volume]);
  
  return null; // No visual component needed
};

export default MeditationAudio;
 