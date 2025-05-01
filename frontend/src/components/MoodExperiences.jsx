import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BoltIcon, // Energetic
  AcademicCapIcon, // Energetic
  SparklesIcon, // Energetic
  LightBulbIcon, // Energetic, Bored
  ShieldCheckIcon, // Anxious
  PlayCircleIcon, // Anxious
  SunIcon, // Lethargic
  SparklesIcon as GratitudeIcon, // Lethargic
  CheckCircleIcon, // Lethargic
  PencilIcon, // Sad, Depressed
  UsersIcon, // Lonely
  ChatBubbleLeftRightIcon, // Lonely
  PuzzlePieceIcon, // Bored
  AdjustmentsHorizontalIcon, // Bored
  MusicalNoteIcon, // Chill
  CloudIcon, // Chill
  HeartIcon, // Depressed
  LifebuoyIcon, // Depressed
} from '@heroicons/react/24/outline';

// Common layout for all mood experiences
const MoodExperienceLayout = ({ title, description, color, children }) => {
  return (
    <div className={`min-h-screen ${color} p-6 md:p-10 flex flex-col font-sans`}>
      <header className="mb-10 flex-shrink-0">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-white text-opacity-80 hover:text-opacity-100 transition-opacity duration-200 bg-black bg-opacity-10 px-3 py-1.5 rounded-full text-sm"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 text-center shadow-sm">{title}</h1>
        <p className="text-white text-opacity-90 text-center mb-10 max-w-xl text-lg">{description}</p>
        
        <div className="w-full space-y-6 md:space-y-8">
          {children}
        </div>
      </div>
      
      {/* Optional Footer */}
      {/* <footer className="mt-10 text-center text-white text-opacity-60 text-sm">
        Zenly - Your mindful companion
      </footer> */}
    </div>
  );
};

// --- Shared Card Component ---
const InfoCard = ({ children, className = '' }) => (
  <div className={`bg-white bg-opacity-25 p-6 md:p-8 rounded-2xl shadow-lg backdrop-filter backdrop-blur-md border border-white border-opacity-20 ${className}`}>
    {children}
  </div>
);

// --- Energetic Experience ---
const EnergeticItem = ({ icon: Icon, text }) => (
  <InfoCard className="hover:bg-opacity-30 transition-all duration-200 cursor-pointer group">
    <div className="flex items-center">
      <Icon className="h-8 w-8 text-white text-opacity-80 mr-4 group-hover:text-opacity-100 transition-opacity" />
      <div>
        <h3 className="text-white text-lg md:text-xl font-semibold">{text}</h3>
        <p className="text-white text-opacity-70 text-sm mt-1 group-hover:text-opacity-90 transition-opacity">Tap to begin</p>
      </div>
    </div>
  </InfoCard>
);

export const EnergeticExperience = () => {
  const activities = [
    { icon: BoltIcon, text: '15-minute focus sprint' },
    { icon: LightBulbIcon, text: 'Creative brainstorming' },
    { icon: SparklesIcon, text: 'Physical movement break' },
    { icon: AcademicCapIcon, text: 'Learn something new' },
  ];
  return (
    <MoodExperienceLayout 
      title="Channel Your Energy" 
      description="Harness your momentum with focused tasks and creative outlets."
      color="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map((activity, index) => (
          <EnergeticItem key={index} icon={activity.icon} text={activity.text} />
        ))}
      </div>
    </MoodExperienceLayout>
  );
};

// --- Anxious Experience ---
export const AnxiousExperience = () => {
  return (
    <MoodExperienceLayout 
      title="Find Your Calm"
      description="Ground yourself with this gentle breathing exercise."
      color="bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600"
    >
      <InfoCard className="text-center">
        <h3 className="text-white text-xl md:text-2xl font-semibold mb-6">Guided Breathing</h3>
        <div className="relative w-40 h-40 md:w-56 md:h-56 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-white border-opacity-30 rounded-full"></div>
          <div 
            className="absolute inset-2 bg-white bg-opacity-20 rounded-full animate-breathe flex items-center justify-center"
            style={{ animationDuration: '12s' }} // 4s inhale + 2s hold + 6s exhale
          >
            <span className="text-white font-medium text-lg">Breathe</span>
          </div>
        </div>
        <p className="text-white text-opacity-90">
          <span className="font-semibold">Inhale</span> (4s) • <span className="font-semibold">Hold</span> (2s) • <span className="font-semibold">Exhale</span> (6s)
        </p>
         {/* Play Button (Optional Functionality) */}
        <button className="mt-6 bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition duration-200 px-4 py-2 rounded-full flex items-center mx-auto">
          <PlayCircleIcon className="w-5 h-5 mr-2"/>
          Start Guided Session
        </button>
      </InfoCard>
    </MoodExperienceLayout>
  );
};

// --- Lethargic Experience ---
const LethargicItem = ({ icon: Icon, text }) => (
  <InfoCard className="flex items-center group cursor-pointer hover:bg-opacity-30 transition-colors duration-200">
    <Icon className="h-7 w-7 text-white text-opacity-80 mr-5 flex-shrink-0 group-hover:text-opacity-100 transition-opacity" />
    <span className="text-white font-medium text-lg group-hover:text-opacity-100 transition-opacity">{text}</span>
    {/* Optional Checkmark? */}
    {/* <CheckCircleIcon className="w-6 h-6 text-white ml-auto opacity-0 group-hover:opacity-50 transition-opacity"/> */}
  </InfoCard>
);

export const LethargicExperience = () => {
  const steps = [
    { icon: SunIcon, text: 'Two-minute stretch' },
    { icon: SparklesIcon, text: 'Splash face with cold water' },
    { icon: GratitudeIcon, text: 'Write one gratitude note' },
    { icon: CheckCircleIcon, text: 'Complete one small task' },
  ];
  return (
    <MoodExperienceLayout 
      title="Gentle Energy Boost"
      description="Small, achievable steps to help you build momentum."
      color="bg-gradient-to-br from-green-400 via-teal-500 to-cyan-600"
    >
      {steps.map((step, index) => (
        <LethargicItem key={index} icon={step.icon} text={step.text} />
      ))}
    </MoodExperienceLayout>
  );
};

// --- Sad Experience ---
export const SadExperience = () => {
  return (
    <MoodExperienceLayout 
      title="A Space for Emotion"
      description="Allow yourself to feel. Journaling can be a gentle way to process."
      color="bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-500"
    >
      <InfoCard>
        <h3 className="text-white text-xl md:text-2xl font-semibold mb-4 flex items-center">
          <PencilIcon className="w-6 h-6 mr-3 opacity-80"/>
          Journal Prompt
        </h3>
        <p className="text-white text-opacity-80 mb-5">What's present for you right now? Describe the feeling without judgment. Remember, all feelings are valid.</p>
        <textarea 
          className="w-full p-4 bg-black bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white text-opacity-90 placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-60 transition duration-200 min-h-[150px]"
          placeholder="Let your thoughts flow..."
        ></textarea>
         <button className="mt-5 bg-white bg-opacity-25 text-white hover:bg-opacity-35 transition duration-200 px-5 py-2 rounded-lg font-medium">
          Save Entry (Optional)
        </button>
      </InfoCard>
    </MoodExperienceLayout>
  );
};

// --- Lonely Experience ---
const LonelyItem = ({ icon: Icon, title, description }) => (
  <InfoCard className="group cursor-pointer hover:bg-opacity-30 transition-colors duration-200">
    <div className="flex items-start">
      <Icon className="h-8 w-8 text-white text-opacity-80 mr-5 mt-1 flex-shrink-0 group-hover:text-opacity-100 transition-opacity"/>
      <div>
        <h3 className="text-white text-xl font-semibold mb-1 group-hover:text-opacity-100 transition-opacity">{title}</h3>
        <p className="text-white text-opacity-80 group-hover:text-opacity-90 transition-opacity">{description}</p>
      </div>
    </div>
  </InfoCard>
);

export const LonelyExperience = () => {
  const actions = [
    { icon: ChatBubbleLeftRightIcon, title: 'Reach Out', description: 'Send a quick message to a friend or family member.' },
    { icon: UsersIcon, title: 'Community Spaces', description: 'Explore online or local groups with shared interests.' },
  ];
  return (
    <MoodExperienceLayout 
      title="Connection Hub"
      description="Feeling disconnected? Here are ways to foster connection."
      color="bg-gradient-to-br from-pink-400 via-red-500 to-orange-600"
    >
      {actions.map((action, index) => (
        <LonelyItem key={index} icon={action.icon} title={action.title} description={action.description} />
      ))}
    </MoodExperienceLayout>
  );
};

// --- Bored Experience ---
const BoredItem = ({ icon: Icon, text }) => (
  <div className="bg-white bg-opacity-25 p-4 rounded-lg text-center hover:bg-opacity-35 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center aspect-square">
    <Icon className="w-8 h-8 text-white opacity-80 mb-2"/>
    <span className="text-white font-medium text-sm md:text-base">{text}</span>
  </div>
);

export const BoredExperience = () => {
  const activities = [
    { icon: AcademicCapIcon, text: 'Learn a skill' },
    { icon: LightBulbIcon, text: 'Creative project' },
    { icon: PuzzlePieceIcon, text: 'Mystery challenge' },
    { icon: AdjustmentsHorizontalIcon, text: 'Mind puzzle' },
  ];
  return (
    <MoodExperienceLayout 
      title="Spark Curiosity"
      description="Shift your focus and engage your mind with something new."
      color="bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400"
    >
      <InfoCard>
        <h3 className="text-white text-xl md:text-2xl font-semibold mb-5 text-center">Try Something Different</h3>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {activities.map((activity, index) => (
            <BoredItem key={index} icon={activity.icon} text={activity.text} />
          ))}
        </div>
      </InfoCard>
    </MoodExperienceLayout>
  );
};

// --- Chill Experience ---
const SoundItem = ({ icon: Icon, text }) => (
  <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center hover:bg-opacity-30 transition-all duration-200 cursor-pointer flex items-center justify-center">
    <Icon className="w-5 h-5 text-white opacity-80 mr-2"/>
    <span className="text-white text-sm md:text-base">{text}</span>
  </div>
);

export const ChillExperience = () => {
   const sounds = [
    { icon: CloudIcon, text: 'Ocean waves' },
    { icon: CloudIcon, text: 'Gentle Rainfall' }, // Could use different icons
    { icon: MusicalNoteIcon, text: 'Forest birds' },
    { icon: MusicalNoteIcon, text: 'Ambient noise' },
  ];
  return (
    <MoodExperienceLayout 
      title="Mindful Relaxation"
      description="Deepen your state of calm with soothing sounds."
      color="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-800"
    >
      <InfoCard>
        <div className="mb-6 flex flex-col items-center">
           <MusicalNoteIcon className="h-12 w-12 text-white opacity-80 mb-3" />
          <h3 className="text-white text-xl md:text-2xl font-semibold">Ambient Soundscape</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:gap-5">
          {sounds.map((sound, index) => (
            <SoundItem key={index} icon={sound.icon} text={sound.text} />
          ))}
        </div>
      </InfoCard>
    </MoodExperienceLayout>
  );
};

// --- Depressed Experience ---
export const DepressedExperience = () => {
  return (
    <MoodExperienceLayout 
      title="Gentle Support"
      description="You're not alone. Here are some tools for self-compassion and finding help."
      color="bg-gradient-to-br from-slate-500 via-slate-700 to-gray-900"
    >
      <InfoCard>
        <h3 className="text-white text-xl md:text-2xl font-semibold mb-2 flex items-center">
          <HeartIcon className="w-6 h-6 mr-3 opacity-80"/>
          Self-Compassion Note
        </h3>
        <p className="text-white text-opacity-80 mb-4">What kind words would you offer a friend feeling this way? Offer them to yourself.</p>
        <textarea 
           className="w-full p-4 bg-black bg-opacity-25 border border-white border-opacity-30 rounded-lg text-white text-opacity-90 placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-60 transition duration-200 min-h-[100px]"
          placeholder="Write a kind message to yourself..."
        ></textarea>
      </InfoCard>
      
      <InfoCard>
        <h3 className="text-white text-xl md:text-2xl font-semibold mb-2 flex items-center">
          <LifebuoyIcon className="w-6 h-6 mr-3 opacity-80"/>
          Find Resources
        </h3>
        <p className="text-white text-opacity-80 mb-4">Remember, reaching out is a sign of strength. Help is available.</p>
        <button className="w-full bg-white bg-opacity-90 text-slate-800 hover:bg-opacity-100 transition duration-200 px-5 py-3 rounded-lg font-semibold text-base flex items-center justify-center">
          <LifebuoyIcon className="w-5 h-5 mr-2"/>
          Explore Support Options
        </button>
      </InfoCard>
    </MoodExperienceLayout>
  );
};

// Add the keyframe animation for breathing
export const GlobalStyles = () => (
  <style jsx global>{`
    @keyframes breathe {
      0%, 100% { transform: scale(0.8); opacity: 0.7; } /* Exhale end / Start */
      33.33% { transform: scale(1.1); opacity: 1; } /* Inhale end (4s / 12s) */
      50% { transform: scale(1.1); opacity: 1; } /* Hold end (6s / 12s) */
      90% { transform: scale(0.8); opacity: 0.7; } /* Exhale near end (approx 11s / 12s) */
    }
    .animate-breathe {
      animation: breathe 12s ease-in-out infinite;
    }
    
    /* Optional: Slower pulse for onboarding selection */
    @keyframes pulse-slow {
       0%, 100% { opacity: 0.3; } 
       50% { opacity: 0.6; } 
    }
    .animate-pulse-slow {
       animation: pulse-slow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    /* Add fade-in animation */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out forwards;
    }
    
    /* Floating animations for background elements */
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    .animate-float-slow {
      animation: float 8s ease-in-out infinite;
    }
    .animate-float-slower {
      animation: float 10s ease-in-out infinite;
    }
    .animate-float-slow-reverse {
      animation: float 9s ease-in-out infinite reverse;
    }
  `}</style>
);

// Re-export all components - REMOVED this block as components are already exported individually
export {
  MoodExperienceLayout,
  EnergeticExperience,
  AnxiousExperience,
  LethargicExperience,
  SadExperience,
  LonelyExperience,
  BoredExperience,
  ChillExperience,
  DepressedExperience,
  GlobalStyles
}; 