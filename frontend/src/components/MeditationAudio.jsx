import { useState, useEffect, useRef, useCallback } from 'react';

// Sound sources with softer, more meditation-friendly tones
const SOUND_SOURCES = {
  // Soft bell sounds
  bells: 'https://freesound.org/data/previews/339/339809_5121236-lq.mp3', // Soft Tibetan bell
  
  // Ambient nature sounds
  nature: 'https://freesound.org/data/previews/521/521275_7724898-lq.mp3', // Gentle forest sounds
  ocean: 'https://freesound.org/data/previews/466/466183_88676-lq.mp3', // Gentle ocean waves
  rainforest: 'https://freesound.org/data/previews/96/96742_1573602-lq.mp3', // Soft rain in forest
  bowls: 'https://freesound.org/data/previews/422/422096_2393266-lq.mp3', // Gentle singing bowl
  chimes: 'https://freesound.org/data/previews/257/257807_4202572-lq.mp3'  // Soft wind chimes
};

// Use AudioContext to create smoother sounds
const createAudioTone = (frequency, duration, volume) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Use sine wave for soft tone
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    // Add volume fading for smoother start/end
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Start and schedule stop with fade out
    oscillator.start();
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime + duration - 0.2);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
    oscillator.stop(audioContext.currentTime + duration);
    
    return { oscillator, gainNode, audioContext };
  } catch (e) {
    console.error('Could not create audio tone:', e);
    return null;
  }
};

const MeditationAudio = ({ 
  isPlaying, 
  soundType = 'bells', 
  volume = 1.0,
  onSoundComplete = () => {},
  onLoadingChange = null, // Optional callback for loading state changes
  onError = null // Optional callback for error handling
}) => {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Announce to screen readers when sound changes
  useEffect(() => {
    if (isPlaying) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('className', 'sr-only');
      announcement.textContent = `${soundType === 'bells' ? 'Bell sound' : 'Ambient sound'} is now playing`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [isPlaying, soundType]);
  
  // Memoized cleanup function to prevent recreating on every render
  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current.src) {
        audioRef.current.src = '';
        audioRef.current.load();
      }
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  }, []);

  // Handle audio playback with fallbacks
  const playAudio = useCallback(() => {
    if (!isPlaying) return;
    
    try {
      // Clean up previous audio
      cleanupAudio();
      
      // Set loading state
      setIsLoading(true);
      if (onLoadingChange) onLoadingChange(true);
      
      // Try HTML5 Audio first - softer and more reliable
      const newAudio = new Audio();
      newAudio.volume = Math.min(volume, 1.0);
      newAudio.preload = 'auto';
      
      // Get source based on sound type
      const source = SOUND_SOURCES[soundType] || SOUND_SOURCES.bells;
      newAudio.src = source;
      
      // Configure audio properties
      newAudio.loop = soundType !== 'bells';
      
      // Add event handlers
      newAudio.oncanplaythrough = () => {
        setIsLoading(false);
        if (onLoadingChange) onLoadingChange(false);
      };
      
      newAudio.onended = () => {
        if (soundType === 'bells') {
          onSoundComplete();
        }
      };
      
      newAudio.onerror = (e) => {
        console.log('Error loading sound, falling back to generated tone', e);
        setLoadError(true);
        setIsLoading(false);
        if (onLoadingChange) onLoadingChange(false);
        if (onError) onError(e);
        
        // Fallback to generated tone
        let tone = null;
        if (soundType === 'bells') {
          // Soft bell-like tone (A4)
          tone = createAudioTone(440, 3, volume * 0.7);
          setTimeout(onSoundComplete, 3000);
        } else {
          // Soft ambient tone (G3, lower frequency for gentler ambient sound)
          tone = createAudioTone(196, Infinity, volume * 0.5);
        }
        
        if (tone) {
          audioContextRef.current = tone.audioContext;
        }
      };
      
      // Attempt to play with retry logic
      const playPromise = newAudio.play();
      if (playPromise) {
        playPromise.catch(error => {
          console.warn('Audio autoplay was prevented, will retry on user interaction', error);
          setLoadError(true);
          setIsLoading(false);
          if (onLoadingChange) onLoadingChange(false);
          if (onError) onError(error);
          
          // Alternative is to wait for user interaction or use generated tone
          const tone = soundType === 'bells' 
            ? createAudioTone(440, 3, volume * 0.7)
            : createAudioTone(196, Infinity, volume * 0.5);
            
          if (tone) {
            audioContextRef.current = tone.audioContext;
            if (soundType === 'bells') {
              setTimeout(onSoundComplete, 3000);
            }
          }
        });
      }
      
      audioRef.current = newAudio;
    } catch (e) {
      console.error('Audio playback failed completely:', e);
      setIsLoading(false);
      if (onLoadingChange) onLoadingChange(false);
      if (onError) onError(e);
    }
  }, [isPlaying, soundType, volume, onSoundComplete, cleanupAudio, onLoadingChange, onError]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(volume, 1.0);
    }
  }, [volume]);
  
  // Handle play/pause based on isPlaying state
  useEffect(() => {
    if (isPlaying) {
      playAudio();
    } else {
      cleanupAudio();
      setIsLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }
    
    return () => {
      cleanupAudio();
      setIsLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    };
  }, [isPlaying, playAudio, cleanupAudio, onLoadingChange]);

  // Support keyboard controls
  useEffect(() => {
    if (!isPlaying) return;
    
    const handleKeyDown = (e) => {
      // Space key toggles play/pause when focused
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        if (audioRef.current) {
          if (audioRef.current.paused) {
            audioRef.current.play().catch(() => {});
          } else {
            audioRef.current.pause();
          }
        }
      }
      
      // Arrow Up/Down for volume
      if (e.key === 'ArrowUp' && audioRef.current) {
        e.preventDefault();
        audioRef.current.volume = Math.min(audioRef.current.volume + 0.1, 1.0);
      }
      
      if (e.key === 'ArrowDown' && audioRef.current) {
        e.preventDefault();
        audioRef.current.volume = Math.max(audioRef.current.volume - 0.1, 0);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);
  
  // Export loading state 
  return null;
};

export default React.memo(MeditationAudio); // Memoize component to prevent unnecessary re-renders
 