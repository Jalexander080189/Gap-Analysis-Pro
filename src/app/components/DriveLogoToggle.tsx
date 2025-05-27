'use client';

import React from 'react';

interface ToggleViewProps {
  showBack: boolean;
  setShowBack: (show: boolean) => void;
  className?: string;
}

const DriveLogoToggle: React.FC<ToggleViewProps> = ({ showBack, setShowBack, className = '' }) => {
  return (
    <button 
      className={`px-3 py-1 bg-blue-600 text-white rounded-md text-sm ${className}`}
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        setShowBack(!showBack);
      }}
      type="button"
    >
      {showBack ? "View Front" : "View Back"}
    </button>
  );
};

export default DriveLogoToggle;
