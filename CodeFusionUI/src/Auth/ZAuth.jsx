import React, { useEffect, useState } from 'react';

const ZAuth = ({
  isAuthenticated,
  setIsAuthenticated
}) => {
  const [rotation, setRotation] = useState(0);
  const [keyPosition, setKeyPosition] = useState(0);
  const [loadingText, setLoadingText] = useState('Authorizing');
  const [dots, setDots] = useState('');

  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 20);

    return () => clearInterval(rotateInterval);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      const keyInterval = setInterval(() => {
        setKeyPosition(prev => {
          if (prev >= 10) {
            setIsAuthenticated(true);
            return 10;
          }
          return prev + 0.2;
        });
      }, 100);

      return () => clearInterval(keyInterval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(textInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <div className="relative w-32 h-32 mb-8">
        <svg className="absolute inset-0" viewBox="0 0 100 100" width="100%" height="100%">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#1c64f2"
            strokeWidth="6"
            strokeDasharray="20,10"
            strokeLinecap="round"
            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
          />
        </svg>

        <svg className="absolute inset-0" viewBox="0 0 100 100" width="100%" height="100%">
          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke="#1c64f2"
            strokeWidth="6"
          />
        </svg>
        <svg className="absolute inset-0" viewBox="0 0 100 100" width="100%" height="100%">
          <g style={{ transform: isAuthenticated ? 'translateY(0px)' : `translateY(${-keyPosition}px)` }}>
            <rect x="47" y="15" width="6" height="30" rx="2" fill="#f6c243" />

            <circle cx="50" cy="50" r="15" fill="#f6c243" stroke="#1c64f2" strokeWidth="2" />
            <rect x="45" y="45" width="10" height="10" rx="2" fill="#1c64f2" />
          </g>
        </svg>
      </div>

      <div className="text-white text-xl font-medium">
        {isAuthenticated ? 'Authorized!' : `${loadingText}${dots}`}
      </div>

      {isAuthenticated && (
        <div className="mt-4 text-green-400 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Secure connection established
        </div>
      )}
    </div>
  );
};

export default ZAuth;