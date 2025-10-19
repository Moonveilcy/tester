import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Moon } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Commit & Push', path: '/commit' },
    { name: 'README Gen', path: '/readme' },
    { name: 'Discord', path: 'https://discord.gg/FnEe7xcYZQ', external: true },
  ];

  const linkClass = "text-gray-600 hover:text-black font-semibold transition-colors";
  const activeLinkClass = "text-black font-bold";

  return (
    <nav className="bg-white/80 backdrop-blur-md w-full shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <Moon className="w-7 h-7 text-purple-600" />
            <span className="text-2xl font-bold text-gray-800">GitMoon</span>
          </Link>
          
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-baseline space-x-8">
              {navLinks.map((link) => 
                link.external ? (
                  <a key={link.name} href={link.path} target="_blank" rel="noopener noreferrer" className={linkClass}>{link.name}</a>
                ) : (
                  <NavLink key={link.name} to={link.path} className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
                    {link.name}
                  </NavLink>
                )
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 hover:text-black">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden px-6 pt-2 pb-4 space-y-2 border-t border-gray-200">
           {navLinks.map((link) => 
            link.external ? (
              <a key={link.name} href={link.path} target="_blank" rel="noopener noreferrer" className={`${linkClass} block py-2`}>{link.name}</a>
            ) : (
              <NavLink key={link.name} to={link.path} onClick={() => setIsOpen(false)} className={({ isActive }) => `${isActive ? activeLinkClass : linkClass} block py-2`}>
                {link.name}
              </NavLink>
            )
          )}
        </div>
      )}
    </nav>
  );
}