'use client';

import React from 'react';

interface ToggleViewProps {
  showBack: boolean;
  setShowBack: (show: boolean) => void;
  className?: string;
}

const DriveLogoToggle: React.FC<ToggleViewProps> = ({ showBack, setShowBack, className = '' }) => {
  // Function to handle the toggle click
  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    console.log('Toggle clicked, current state:', showBack);
    setShowBack(!showBack);
    console.log('Toggle clicked, new state:', !showBack);
  };

  return (
    <button 
      className={`px-3 py-1 bg-blue-600 text-white rounded-md text-sm ${className}`}
      onClick={handleToggleClick}
      type="button"
      aria-label={showBack ? "View Front" : "View Back"}
    >
      {showBack ? "View Front" : "View Back"}
    </button>
  );
};

export default DriveLogoToggle;