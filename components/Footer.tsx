/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REMIX_SUGGESTIONS = [
  "💡 Try different poses to see outfits from various angles.",
  "👔 Mix and match clothing items to create unique styles.",
  "📸 Save your favorite outfit combinations for later.",
  "🎨 Experiment with different colors and patterns.",
  "👗 Try layering multiple clothing items together.",
  "🌟 Share your virtual try-on results with friends.",
];

interface FooterProps {
  isOnDressingScreen?: boolean;
  onGoToProfile?: () => void;
}

const Footer: React.FC<FooterProps> = ({ isOnDressingScreen = false, onGoToProfile }) => {
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prevIndex) => (prevIndex + 1) % REMIX_SUGGESTIONS.length);
    }, 4000); // Change suggestion every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={`fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200/60 p-3 z-50 ${isOnDressingScreen ? 'hidden sm:block' : ''}`}>
      <div className="mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 max-w-7xl px-4">
        <div className="flex items-center gap-4">
          <p>
            Created by{' '}
            <a 
              href="https://zalo.me/0344396798" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-gray-800 hover:underline"
            >
              Huy Quang
            </a>
          </p>
          {onGoToProfile && (
            <button 
              onClick={onGoToProfile}
              className="text-gray-600 hover:text-gray-800 font-medium hover:underline"
            >
              Profile Settings
            </button>
          )}
        </div>
        <div className="h-4 mt-1 sm:mt-0 flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={suggestionIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="text-center sm:text-right"
              >
                {REMIX_SUGGESTIONS[suggestionIndex]}
              </motion.p>
            </AnimatePresence>
        </div>
      </div>
    </footer>
  );
};

export default Footer;