import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Zenly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 