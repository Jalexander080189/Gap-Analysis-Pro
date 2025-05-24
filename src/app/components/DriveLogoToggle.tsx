'use client';

import React from 'react';
import Image from 'next/image';

interface ToggleViewProps {
  showBack: boolean;
  setShowBack: (show: boolean) => void;
  className?: string;
}

const DriveLogoToggle: React.FC<ToggleViewProps> = ({ showBack, setShowBack, className = '' }) => {
  return (
    <div 
      className={`toggle-view-button absolute top-4 right-4 z-10 ${className}`}
      onClick={() => setShowBack(!showBack)}
      title={showBack ? "View Front" : "View Back"}
    >
      <Image 
        src="/images/drive_logo_d.png" 
        alt="Toggle View" 
        width={32} 
        height={32}
        className={`transition-transform duration-300 ${showBack ? 'rotate-180' : ''}`}
      />
    </div>
  );
};

export default DriveLogoToggle;
