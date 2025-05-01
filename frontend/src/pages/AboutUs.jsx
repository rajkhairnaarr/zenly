import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
        <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-700 mb-8">
          Welcome to Zenly — your digital sanctuary for mindfulness, calm, and clarity.
        </p>

        <p className="text-gray-600 mb-6">
          At Zenly, we believe that inner peace isn't a luxury — it's a necessity. Our mission is to make meditation accessible, intuitive, and deeply personal. Whether you're taking your first breath of mindfulness or are deep into your journey, Zenly offers tools to help you stay grounded.
        </p>

        <p className="text-gray-600 mb-6">
          Our growing library of guided meditations, in-app mindfulness exercises, and daily prompts is designed to meet you where you are. Built with care, our platform is light, distraction-free, and always evolving.
        </p>

        <p className="text-gray-600 mb-6">
          Zenly was created by a team who understands the chaos of modern life — and the need to find stillness within it.
        </p>

        <p className="text-xl text-gray-700 italic">
          Breathe in. Breathe out. You're home.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Guided Meditations</h3>
          <p className="text-gray-600">Expert-led sessions for every need and experience level.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
          <p className="text-gray-600">Visualize your journey with our unique tree growth feature.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Daily Practice</h3>
          <p className="text-gray-600">Build consistent habits with our intuitive tools and reminders.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 