import React from 'react';
import { Link } from 'react-router-dom';

// Common layout for all mood experiences
const MoodExperienceLayout = ({ title, description, color, children }) => {
  return (
    <div className={`min-h-screen ${color} p-6 flex flex-col`}>
      <header className="mb-8">
        <Link to="/dashboard" className="text-white hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </Link>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h1>
        <p className="text-white text-opacity-90 text-center mb-8 max-w-lg">{description}</p>
        
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

// Energetic Experience
export const EnergeticExperience = () => {
  return (
    <MoodExperienceLayout 
      title="Channel Your Energy" 
      description="We've curated these productivity tools and creative prompts to help you make the most of your energetic state."
      color="bg-gradient-to-b from-yellow-400 to-orange-500"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['15-minute focus sprint', 'Creative brainstorming', 'Physical movement break', 'Idea capture'].map((activity, index) => (
          <div key={index} className="bg-white bg-opacity-20 p-6 rounded-xl backdrop-filter backdrop-blur-sm hover:bg-opacity-30 transition-all cursor-pointer">
            <h3 className="text-white text-xl font-semibold mb-2">{activity}</h3>
            <p className="text-white text-opacity-80">Tap to begin</p>
          </div>
        ))}
      </div>
    </MoodExperienceLayout>
  );
};

// Anxious Experience
export const AnxiousExperience = () => {
  return (
    <MoodExperienceLayout 
      title="Finding Calm"
      description="These exercises can help bring a sense of peace and centeredness when you're feeling anxious."
      color="bg-gradient-to-b from-blue-400 to-indigo-600"
    >
      <div className="bg-white bg-opacity-20 p-8 rounded-xl backdrop-filter backdrop-blur-sm">
        <h3 className="text-white text-xl font-semibold mb-4">Breathing Exercise</h3>
        <div className="w-32 h-32 rounded-full bg-white bg-opacity-30 mx-auto flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white bg-opacity-40 animate-pulse-slow flex items-center justify-center">
            <span className="text-white">Breathe</span>
          </div>
        </div>
        <p className="text-white text-center">Inhale for 4 seconds, hold for 2, exhale for 6</p>
      </div>
    </MoodExperienceLayout>
  );
};

// Lethargic Experience
export const LethargicExperience = () => {
  return (
    <MoodExperienceLayout 
      title="Gentle Energy Boost"
      description="Small steps to help you find motivation and energy when you're feeling lethargic."
      color="bg-gradient-to-b from-green-400 to-teal-500"
    >
      <div className="space-y-4">
        {['Two-minute stretch', 'Cold water splash', 'Quick gratitude note', 'One small task'].map((step, index) => (
          <div key={index} className="bg-white bg-opacity-20 p-4 rounded-lg flex items-center backdrop-filter backdrop-blur-sm">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-teal-600 mr-4">
              {index + 1}
            </div>
            <span className="text-white font-medium">{step}</span>
          </div>
        ))}
      </div>
    </MoodExperienceLayout>
  );
};

// Sad Experience
export const SadExperience = () => {
  return (
    <MoodExperienceLayout 
      title="Emotional Space"
      description="A gentle space to process your feelings with validation and self-compassion."
      color="bg-gradient-to-b from-purple-400 to-purple-600"
    >
      <div className="bg-white bg-opacity-20 p-6 rounded-xl backdrop-filter backdrop-blur-sm">
        <h3 className="text-white text-xl font-semibold mb-4">Journal Prompt</h3>
        <p className="text-white text-opacity-90 mb-6">What emotions are present for you right now? Remember that all feelings are valid and temporary.</p>
        <textarea 
          className="w-full p-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          placeholder="Start writing here..."
          rows={6}
        ></textarea>
      </div>
    </MoodExperienceLayout>
  );
};

// Lonely Experience
export const LonelyExperience = () => {
  return (
    <MoodExperienceLayout 
      title="Connection Center"
      description="Finding meaningful connection when feeling lonely."
      color="bg-gradient-to-b from-pink-400 to-red-500"
    >
      <div className="space-y-6">
        <div className="bg-white bg-opacity-20 p-6 rounded-xl backdrop-filter backdrop-blur-sm">
          <h3 className="text-white text-xl font-semibold mb-2">Reach Out</h3>
          <p className="text-white text-opacity-80">Choose someone from your contacts to connect with today</p>
        </div>
        
        <div className="bg-white bg-opacity-20 p-6 rounded-xl backdrop-filter backdrop-blur-sm">
          <h3 className="text-white text-xl font-semibold mb-2">Community Spaces</h3>
          <p className="text-white text-opacity-80">Find groups of people with similar interests</p>
        </div>
      </div>
    </MoodExperienceLayout>
  );
};

// Bored Experience
export const BoredExperience = () => {
  return (
    <MoodExperienceLayout 
      title="Curiosity Spark"
      description="Discover new activities and mental stimulation for when you're feeling bored."
      color="bg-gradient-to-b from-blue-300 to-indigo-400"
    >
      <div className="bg-white bg-opacity-20 p-6 rounded-xl backdrop-filter backdrop-blur-sm">
        <h3 className="text-white text-xl font-semibold mb-4">Try Something New</h3>
        <div className="grid grid-cols-2 gap-4">
          {['Learn a skill', 'Creative project', 'Mystery challenge', 'Mental puzzle'].map((activity, index) => (
            <div key={index} className="bg-white bg-opacity-20 p-4 rounded-lg text-center hover:bg-opacity-30 transition-all cursor-pointer">
              <span className="text-white">{activity}</span>
            </div>
          ))}
        </div>
      </div>
    </MoodExperienceLayout>
  );
};

// Chill Experience
export const ChillExperience = () => {
  return (
    <MoodExperienceLayout 
      title="Mindful Moments"
      description="Enhance your relaxed state with gratitude and ambient experiences."
      color="bg-gradient-to-b from-blue-500 to-blue-700"
    >
      <div className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-filter backdrop-blur-sm">
        <div className="mb-6 flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <h3 className="text-white text-xl font-semibold">Ambient Sounds</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {['Ocean waves', 'Rainfall', 'Forest birds', 'Gentle wind'].map((sound, index) => (
            <div key={index} className="bg-white bg-opacity-20 p-3 rounded-lg text-center hover:bg-opacity-30 transition-all cursor-pointer">
              <span className="text-white">{sound}</span>
            </div>
          ))}
        </div>
      </div>
    </MoodExperienceLayout>
  );
};

// Depressed Experience
export const DepressedExperience = () => {
  return (
    <MoodExperienceLayout 
      title="Gentle Support"
      description="Small steps and compassionate tools for when you're feeling depressed."
      color="bg-gradient-to-b from-blue-600 to-blue-900"
    >
      <div className="space-y-6">
        <div className="bg-white bg-opacity-20 p-6 rounded-xl backdrop-filter backdrop-blur-sm">
          <h3 className="text-white text-xl font-semibold mb-2">Self-Compassion Note</h3>
          <p className="text-white text-opacity-80 mb-4">What would you say to a friend feeling this way?</p>
          <textarea 
            className="w-full p-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            placeholder="Write a kind message to yourself..."
            rows={3}
          ></textarea>
        </div>
        
        <div className="bg-white bg-opacity-20 p-6 rounded-xl backdrop-filter backdrop-blur-sm">
          <h3 className="text-white text-xl font-semibold mb-2">Resources</h3>
          <p className="text-white mb-4">Remember that help is available if you need it.</p>
          <button className="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium">
            Support Options
          </button>
        </div>
      </div>
    </MoodExperienceLayout>
  );
}; 