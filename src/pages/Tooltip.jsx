import React, { useState } from 'react';

export const Tooltip = ({ children, content, position = 'bottom' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div className={`absolute z-10 w-64 p-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg shadow-lg ${
          position === 'bottom' ? 'mt-2 top-full' : 'mb-2 bottom-full'
        }`}>
          {content}
          <div className={`absolute w-3 h-3 bg-white border-t border-l border-gray-200 ${
            position === 'bottom' 
              ? '-top-1.5 left-4 transform rotate-45' 
              : '-bottom-1.5 left-4 transform rotate-225'
          }`}></div>
        </div>
      )}
    </div>
  );
};