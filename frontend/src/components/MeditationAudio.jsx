import { useState, useEffect, useRef } from 'react';

const MeditationAudio = ({ 
  isPlaying, 
  soundType = 'bells', 
  volume = 0.5,
  onSoundComplete = () => {}
}) => {
  const audioRef = useRef(null);
  const [soundLoaded, setSoundLoaded] = useState(false);
  
  // Map of available sounds
  const sounds = {
    bells: '/sounds/meditation-bells.mp3',
    nature: '/sounds/nature-ambience.mp3',
    bowls: '/sounds/singing-bowls.mp3',
    ocean: '/sounds/ocean-waves.mp3',
    rainforest: '/sounds/rainforest.mp3',
    chimes: '/sounds/wind-chimes.mp3'
  };
  
  // Load the audio when component mounts
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Set up audio
    audioRef.current.src = sounds[soundType] || sounds.bells;
    audioRef.current.volume = volume;
    audioRef.current.loop = soundType !== 'bells'; // Loop background sounds but not bells
    
    // Mark as loaded when ready
    audioRef.current.oncanplaythrough = () => {
      setSoundLoaded(true);
    };
    
    // Handle sound completion
    audioRef.current.onended = () => {
      if (soundType === 'bells') {
        onSoundComplete();
      }
    };
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [soundType, volume, onSoundComplete]);
  
  // Play/pause based on isPlaying prop
  useEffect(() => {
    if (!audioRef.current || !soundLoaded) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      
      // Handle autoplay restrictions
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Audio playback failed:', error);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, soundLoaded]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  return (
    <audio ref={audioRef} preload="auto">
      Your browser does not support the audio element.
    </audio>
  );
};

export default MeditationAudio; 