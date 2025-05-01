import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  HeartIcon,
  PencilSquareIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  FireIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

// Define a variable at global scope to avoid unintentional shadowing
// This will also help catch any references to an undefined global
const defaultUserName = 'User';

const Dashboard = () => {
  const [stats, setStats] = useState({
    meditationCount: 0,
    journalCount: 0,
    moodCount: 0,
    streak: 0,
  });
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [dashboardUserName, setDashboardUserName] = useState(defaultUserName);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Random inspirational quote
    const quotes = [
      { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
      { text: "The present moment is the only time over which we have dominion.", author: "Thích Nhất Hạnh" },
      { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
      { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
      { text: "You are the sky. Everything else is just the weather.", author: "Pema Chödrön" }
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Try to get user name from localStorage or other sources
    const storedUserName = localStorage.getItem('userName') || defaultUserName;
    setDashboardUserName(storedUserName);

    // For now, we'll just set some mock values
    setStats({
      meditationCount: 4,
      journalCount: 7,
      moodCount: 12,
      streak: 3,
    });
  }, []);

  const features = [
    {
      name: 'Meditation Library',
      description: 'Guided sessions for calm and focus',
      icon: BookOpenIcon,
      link: '/meditations',
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      image: '🧘‍♀️',
    },
    {
      name: 'Mood Tracker',
      description: 'Monitor your emotional wellbeing',
      icon: HeartIcon,
      link: '/mood',
      color: 'bg-rose-100',
      iconColor: 'text-rose-600',
      image: '😊',
    },
    {
      name: 'Journal',
      description: 'Reflect on your thoughts and feelings',
      icon: PencilSquareIcon,
      link: '/journal',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      image: '📝',
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to Zenly, {dashboardUserName || defaultUserName}
        </h1>
        <p className="mt-2 text-gray-600">
          Your personal space for mindfulness and mental well-being.
        </p>
      </div>

      {/* Hero Section with Illustration */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-20 h-[350px] w-[350px] rounded-full bg-primary-500 opacity-20"></div>
        <div className="absolute bottom-0 left-0 -mb-24 -ml-48 h-[400px] w-[400px] rounded-full bg-primary-500 opacity-20"></div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-8 sm:p-12">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{greeting}</h1>
            <p className="text-xl opacity-90">Your daily companion for mindfulness and wellbeing</p>
            
            <div className="mt-8">
              <blockquote className="italic opacity-90">"{quote.text}"</blockquote>
              <p className="mt-2 text-sm">— {quote.author}</p>
            </div>
            
            <div className="pt-4">
              <Link 
                to="/meditations"
                className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-primary-700 hover:bg-primary-50 transition-colors"
              >
                Start Today's Session
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="text-9xl">🧠</div>
              <div className="mt-4 text-xl font-medium">Mind & Wellness</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Check Section */}
      <div className="bg-gradient-radial from-amber-100 via-pink-100 to-blue-100 rounded-3xl p-8 shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">How are you feeling today?</h2>
          <p className="text-gray-600 mt-2">Taking a moment to check in with yourself can improve your well-being</p>
        </div>
        
        <div className="flex justify-center">
          <Link
            to="/onboarding"
            className="bg-white hover:bg-blue-50 text-blue-600 font-semibold px-8 py-3 rounded-full shadow-lg transform transition-all hover:scale-105 flex items-center space-x-2"
          >
            <BoltIcon className="h-5 w-5" />
            <span>Check Your Mood</span>
            <span className="text-xl ml-2">🌈</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="rounded-xl bg-green-50 p-6 shadow-sm border border-green-100">
          <div className="flex justify-between">
            <CalendarDaysIcon className="h-10 w-10 text-green-500" />
            <div className="text-3xl">🔥</div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{stats.streak}</p>
          <p className="mt-1 text-sm text-gray-600">Day Streak</p>
        </div>
        
        <div className="rounded-xl bg-purple-50 p-6 shadow-sm border border-purple-100">
          <div className="flex justify-between">
            <BookOpenIcon className="h-10 w-10 text-purple-500" />
            <div className="text-3xl">🧘</div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{stats.meditationCount}</p>
          <p className="mt-1 text-sm text-gray-600">Meditations</p>
        </div>
        
        <div className="rounded-xl bg-blue-50 p-6 shadow-sm border border-blue-100">
          <div className="flex justify-between">
            <PencilSquareIcon className="h-10 w-10 text-blue-500" />
            <div className="text-3xl">📝</div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{stats.journalCount}</p>
          <p className="mt-1 text-sm text-gray-600">Journal Entries</p>
        </div>
        
        <div className="rounded-xl bg-rose-50 p-6 shadow-sm border border-rose-100">
          <div className="flex justify-between">
            <HeartIcon className="h-10 w-10 text-rose-500" />
            <div className="text-3xl">😊</div>
          </div>
          <p className="mt-4 text-3xl font-bold text-gray-900">{stats.moodCount}</p>
          <p className="mt-1 text-sm text-gray-600">Mood Entries</p>
        </div>
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Your Wellness Tools</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.name}
              to={feature.link}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:border-primary-500 hover:shadow-lg transition-all"
            >
              <div className="absolute right-0 top-0 h-24 w-24 -mr-8 -mt-8 rounded-full opacity-10 bg-primary-500 group-hover:bg-primary-600 transition-colors"></div>
              
              <div className={`inline-flex rounded-lg ${feature.color} p-3`}>
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              
              <div className="absolute right-6 bottom-6 text-4xl opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all">
                {feature.image}
              </div>
              
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {feature.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 max-w-[80%]">{feature.description}</p>
              
              <div className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 group-hover:text-primary-700">
                <span>Get started</span>
                <ArrowRightIcon className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested Activity */}
      <div className="rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 p-6 shadow-sm border border-amber-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FireIcon className="h-5 w-5 text-amber-500 mr-2" />
              Suggested for Today
            </h3>
            <p className="mt-2 text-gray-600">5-minute breathing meditation to center your mind</p>
            <div className="mt-4">
              <Link
                to="/meditations"
                className="inline-flex items-center rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 transition-colors"
              >
                <BoltIcon className="mr-2 h-4 w-4" />
                Quick Start
              </Link>
            </div>
          </div>
          <div className="hidden md:block text-7xl">
            🧘‍♂️
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 