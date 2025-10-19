import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/70 border-b border-indigo-500/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Moon className="w-8 h-8 text-indigo-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
              GitMoon
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#features"
              className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
            >
              GitHub
            </a>
            <a
              href="#docs"
              className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
            >
              Docs
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
