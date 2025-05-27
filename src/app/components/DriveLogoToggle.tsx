'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

interface ToggleViewProps {
  showBack: boolean;
  setShowBack: (show: boolean) => void;
  className?: string;
}

const DriveLogoToggle: React.FC<ToggleViewProps> = ({ showBack, setShowBack, className = '' }) => {
  useEffect(() => {
    console.log('DriveLogoToggle rendered, showBack:', showBack);
    console.log('Image path:', '/images/drive_logo_d.png');
  }, [showBack]);

  return (
    <div 
      className={`toggle-view-button absolute top-4 right-4 z-10 ${className}`}
      onClick={() => setShowBack(!showBack)}
      title={showBack ? "View Front" : "View Back"}
    >
      {/* Fallback text that shows if image fails to load */}
      <span className="text-blue-600 font-bold text-sm absolute">
        {showBack ? "Front" : "Back"}
      </span>
      <Image 
        src="/images/drive_logo_d.png" 
        alt="Toggle View" 
        width={32} 
        height={32}
        className={`transition-transform duration-300 ${showBack ? 'rotate-180' : ''}`}
        onError={(e) => {
          console.error('Failed to load image: /images/drive_logo_d.png');
          // Hide the image if it fails to load
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default DriveLogoToggle;
