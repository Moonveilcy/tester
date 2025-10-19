import { useState } from 'react';
// PERUBAHAN: Import Link dari react-router-dom
import { Link } from 'react-router-dom';
import { Moon, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Commit & Push', to: '/commit' },
    { name: 'Discord', to: 'https://discord.com', isExternal: true },
  ];

  return (
    <nav className="bg-white text-black relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <Moon className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-800">
                GitMoon
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-grow items-center justify-center">
            <div className="flex items-baseline space-x-6">
              {navLinks.map((link) => 
                link.isExternal ? (
                  <a key={link.name} href={link.to} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200">
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-purple-600 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => 
               link.isExternal ? (
                <a key={link.name} href={link.to} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium">
                  {link.name}
                </a>
               ) : (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  {link.name}
                </Link>
               )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}