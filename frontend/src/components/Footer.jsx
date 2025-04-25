import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">
              Project Team Members
            </h3>
            <ul className="space-y-2">
              <li className="text-base text-gray-600">
                Raj Shivdas Khairnar (PRN No: 4422001819)
              </li>
              <li className="text-base text-gray-600">
                Kunal Shivaji Gaikwad (PRN No: 4422001829)
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">
              Internal Guide
            </h3>
            <ul className="space-y-2">
              <li className="text-base text-gray-600">
                Ms. Rakhshanda Shaikh
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">
              About Zenly
            </h3>
            <p className="text-base text-gray-600">
              Zenly is a meditation and mental wellbeing application designed to help users
              track their mood, practice meditation, and improve their overall mental health.
            </p>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 flex justify-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Zenly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 