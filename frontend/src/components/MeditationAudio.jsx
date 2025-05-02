import { useState, useEffect, useRef } from 'react';

// Import sample bell sound as base64 - small file (~10KB)
// This is a base64-encoded short bell sound

const MeditationAudio = ({ 
  isPlaying, 
  soundType = 'bells', 
  volume = 1.0,  // Maximum volume (100%)
  onSoundComplete = () => {}
}) => {
  const [audio, setAudio] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Create a better audio experience with distinct sounds
  useEffect(() => {
    // Clean up any previous audio
    if (audio) {
      audio.pause();
      audio.src = '';
    }

    // Create a new audio element
    const newAudio = new Audio();
    newAudio.volume = volume;
    newAudio.loop = soundType !== 'bells';
    
    // Use distinct sounds for different meditation types
    if (soundType === 'bells') {
      newAudio.src = "https://soundbible.com/grab.php?id=1496&type=mp3"; // Tibetan Bell
    } else if (soundType === 'nature') {
      newAudio.src = "https://soundbible.com/grab.php?id=2196&type=mp3"; // Forest Ambience
    } else if (soundType === 'ocean') {
      newAudio.src = "https://soundbible.com/grab.php?id=2120&type=mp3"; // Ocean Waves
    } else if (soundType === 'rainforest') {
      newAudio.src = "https://soundbible.com/grab.php?id=2197&type=mp3"; // Rainforest Ambience
    } else if (soundType === 'bowls') {
      newAudio.src = "https://soundbible.com/grab.php?id=2218&type=mp3"; // Singing Bowl
    } else if (soundType === 'chimes') {
      newAudio.src = "https://soundbible.com/grab.php?id=2219&type=mp3"; // Wind Chimes
    } else {
      // Fallback to a basic tone
      newAudio.src = "https://soundbible.com/grab.php?id=1496&type=mp3";
    }

    // Handle audio load event
    newAudio.oncanplaythrough = () => {
      console.log(`Audio loaded: ${soundType} at volume ${volume}`);
      setIsLoaded(true);
    };

    // Handle end of audio
    newAudio.onended = () => {
      console.log(`Audio ended: ${soundType}`);
      if (soundType === 'bells') {
        onSoundComplete();
      }
    };

    // Handle errors
    newAudio.onerror = (e) => {
      console.error(`Audio error for ${soundType}:`, e);
      
      // Fallback to browser-generated sound on error
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Configure the sound based on type
      if (soundType === 'bells') {
        oscillator.type = 'sine';
        oscillator.frequency.value = 880; // High bell sound
        gainNode.gain.value = volume;
        
        oscillator.start();
        setTimeout(() => {
          oscillator.stop();
          onSoundComplete();
        }, 1000);
      } else {
        oscillator.type = 'sine';
        oscillator.frequency.value = 440; // Lower ambient sound
        gainNode.gain.value = volume * 0.8; // Slightly lower volume for background
        
        oscillator.start();
        // Don't stop for looping sounds
      }
    };

    setAudio(newAudio);

    // Clean up
    return () => {
      if (newAudio) {
        newAudio.pause();
        newAudio.src = '';
      }
    };
  }, [soundType, volume, onSoundComplete]);

  // Handle play/pause
  useEffect(() => {
    if (!audio) return;

    if (isPlaying && isLoaded) {
      // Attempt to play with full volume
      audio.volume = volume;
      
      // Create user interaction by clicking the document to help with autoplay
      document.body.click();
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log(`Successfully playing ${soundType} at volume ${volume}`);
        }).catch(error => {
          console.error('Audio play failed:', error);
          
          // On failure, try once more with a user interaction
          document.addEventListener('click', function playOnClick() {
            audio.play().catch(e => console.error('Retry failed:', e));
            document.removeEventListener('click', playOnClick);
          }, { once: true });
          
          // Alert the user they need to interact
          console.log('User interaction required for audio. Please click anywhere on the page.');
        });
      }
    } else if (audio) {
      audio.pause();
    }
  }, [isPlaying, audio, isLoaded, soundType, volume]);

  return (
    <div onClick={() => { 
      if (audio && isPlaying && !audio.paused) {
        console.log("Audio is playing!");
      } else if (audio && isPlaying) {
        audio.play().catch(e => console.log("Click didn't help:", e));
      }
    }} style={{position: 'absolute', width: '1px', height: '1px', overflow: 'hidden'}}>
      {/* Hidden element to help with audio playback */}
    </div>
  );
};

export default MeditationAudio;
 