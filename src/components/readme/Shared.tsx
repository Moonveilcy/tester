import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => (
  <div className={`border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] ${className}`} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ children, className, ...props }: CardProps) => (
  <div className={`p-4 border-b-2 border-black ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }: CardProps) => (
  <h3 className={`font-bold text-lg text-gray-800 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ children, className, ...props }: CardProps) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

export const UnapologeticButton = ({ children, className, variant = 'primary', ...props }: ButtonProps) => {
    const baseClasses = "relative inline-block w-full px-8 py-3 font-bold text-black rounded-lg transition-transform duration-200 ease-in-out border-b-4 border-r-4 border-black group-hover:border-b-2 group-hover:border-r-2 group-hover:translate-x-0.5 group-hover:translate-y-0.5";
    
    const variantClasses = {
      primary: 'bg-yellow-400 hover:bg-yellow-500',
      secondary: 'bg-purple-500 hover:bg-purple-600',
    };

    return (
        <button className={`relative group ${className}`} {...props}>
            <div className={`${baseClasses} ${variantClasses[variant]}`}>
                <div className="relative z-10 flex items-center justify-center gap-2">
                    {children}
                </div>
            </div>
        </button>
    );
};