import { Github } from 'lucide-react';

const UnapologeticButton = ({ href, children, className, variant = 'primary' }) => {
  const baseClasses = "relative inline-block px-8 py-3 font-bold text-black rounded-lg transition-transform duration-200 ease-in-out";
  
  const variantClasses = {
    primary: 'bg-yellow-400 hover:bg-yellow-500',
    secondary: 'bg-purple-500 hover:bg-purple-600',
  };

  const buttonContent = (
    <div className="relative z-10 flex items-center justify-center gap-2">
      {children}
    </div>
  );

  const buttonWrapperClasses = `relative w-full sm:w-auto group ${className}`;
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} 
                         border-b-4 border-r-4 border-black 
                         group-hover:border-b-2 group-hover:border-r-2 
                         group-hover:translate-x-0.5 group-hover:translate-y-0.5`;
  
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonWrapperClasses}>
        <div className={buttonClasses}>
          {buttonContent}
        </div>
      </a>
    );
  }

  return (
    <button className={buttonWrapperClasses}>
      <div className={buttonClasses}>
        {buttonContent}
      </div>
    </button>
  );
};

export default function Hero() {
  return (
    <section id="home" className="bg-white text-black flex items-center py-20 lg:py-28">
      <div className="container mx-auto px-6 max-w-6xl"> 
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16">
          
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-gray-800">
              <span className="bg-gradient-to-r from-purple-500 to-yellow-500 bg-clip-text text-transparent">
                Push. Commit. Automate.
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 max-w-lg mx-auto md:mx-0">
              GitMoon helps you manage GitHub repositories directly from mobile — commit, upload, and document with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-6">
              <UnapologeticButton variant="primary">
                Try Now
              </UnapologeticButton>
              
              <UnapologeticButton 
                href="https://github.com" 
                variant="secondary"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </UnapologeticButton>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
            <img 
              src="/gitmoon.png" 
              alt="GitMoon Illustration" 
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-lg"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/e5e7eb/1f2937?text=GitMoon'; }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}