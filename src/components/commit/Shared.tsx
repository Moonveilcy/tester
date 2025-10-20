import React from 'react';

export const OffsetShadowCard = ({ children, color = 'yellow', className = '' }) => {
  const colorClasses = {
    yellow: 'bg-yellow-300',
    purple: 'bg-purple-300',
    sky: 'bg-sky-300',
    pink: 'bg-pink-300',
    red: 'bg-red-200',
  };

  return (
    <div className={`p-6 rounded-lg border-2 border-black ${colorClasses[color]} ${className}`} style={{ boxShadow: '4px 4px 0px #000' }}>
      {children}
    </div>
  );
};

export const UnapologeticButton = ({ children, onClick, disabled, variant = 'primary', className = '' }) => {
    const baseClasses = "w-full relative inline-block px-6 py-3 font-bold text-black rounded-lg transition-transform duration-200 ease-in-out";
    
    const variantClasses = {
      primary: 'bg-yellow-400 hover:bg-yellow-500',
      secondary: 'bg-purple-400 hover:bg-purple-500',
      tertiary: 'bg-gray-400 hover:bg-gray-500',
      danger: 'bg-red-500 hover:bg-red-600',
    };
  
    const buttonClasses = `${baseClasses} ${variantClasses[variant]} 
                           border-b-4 border-r-4 border-black 
                           active:border-b-2 active:border-r-2 
                           active:translate-x-0.5 active:translate-y-0.5
                           disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-500`;
  
    return (
      <button onClick={onClick} disabled={disabled} className={`group w-full ${className}`}>
        <div className={buttonClasses}>
            {children}
        </div>
      </button>
    );
};