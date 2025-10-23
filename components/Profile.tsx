/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShirtIcon, ArrowLeftIcon } from './icons';

interface ProfileProps {
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage
    const savedApiKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsValid(true);
    }
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setValidationMessage('Please enter your Gemini API key');
      setIsValid(false);
      return;
    }

    setIsValidating(true);
    setValidationMessage('');

    try {
      // Save to localStorage
      localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
      
      // Update environment variable for current session
      (window as any).GEMINI_API_KEY = apiKey.trim();
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('apiKeyChanged'));
      
      setValidationMessage('API key saved successfully!');
      setIsValid(true);
    } catch (error) {
      setValidationMessage('Failed to save API key. Please try again.');
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('GEMINI_API_KEY');
    setApiKey('');
    setIsValid(false);
    setValidationMessage('');
    (window as any).GEMINI_API_KEY = '';
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('apiKeyChanged'));
  };

  const viewVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  return (
    <motion.div
      className="w-full min-h-screen flex items-start sm:items-center justify-center bg-gray-50 p-4 pb-20 overflow-x-hidden"
      variants={viewVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="w-full max-w-md mx-auto overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <ShirtIcon className="w-6 h-6 text-gray-700 flex-shrink-0" />
          <h1 className="text-xl sm:text-2xl font-serif tracking-widest text-gray-800 truncate">
            Profile Settings
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/60 p-4 sm:p-6 overflow-x-hidden">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              API Configuration
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your Gemini API key to enable AI-powered virtual try-on features.
            </p>
          </div>

          {/* API Key Input */}
          <div className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                Gemini API Key
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                disabled={isValidating}
              />
            </div>

            {/* Validation Message */}
            {validationMessage && (
              <div className={`p-3 rounded-lg text-sm ${
                isValid 
                  ? 'bg-green-100 border border-green-200 text-green-700' 
                  : 'bg-red-100 border border-red-200 text-red-700'
              }`}>
                {validationMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveApiKey}
                disabled={isValidating || !apiKey.trim()}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isValidating ? 'Saving...' : 'Save API Key'}
              </button>
              
              {apiKey && (
                <button
                  onClick={handleClearApiKey}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 sm:flex-shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg overflow-x-hidden">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              How to get your API key:
            </h3>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>Visit <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">Google AI Studio</a></li>
              <li>Sign in with your Google account</li>
              <li>Click "Create API Key"</li>
              <li>Copy the generated key and paste it above</li>
            </ol>
          </div>
        </div>

        {/* Status Indicator */}
        {isValid && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="text-center">API key configured successfully</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
