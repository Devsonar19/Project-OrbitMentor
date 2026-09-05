import React from 'react';
import { Sun, Moon, Sparkles, Compass, GraduationCap } from 'lucide-react';

interface NavbarProps {
  activeScreen: 'generator' | 'mentor';
  onSelectScreen: (screen: 'generator' | 'mentor') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  selectedIdeaTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onSelectScreen,
  isDarkMode,
  onToggleTheme,
  selectedIdeaTitle,
}) => {
  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-30 w-full border-b backdrop-blur-md transition-colors duration-200 border-slate-200/80 bg-white/90 dark:border-zinc-800 dark:bg-zinc-950/90"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => onSelectScreen('generator')}
            aria-label="PROJECT ORBITMENTOR - Return to Idea Generator"
            className="cursor-pointer flex items-center space-x-2.5 group text-left focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded-xl p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform" aria-hidden="true">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  PROJECT ORBITMENTOR
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                  Capstone AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 hidden sm:block">
                Final Year Project Ideas & Technical Architecture Mentor
              </p>
            </div>
          </button>
        </div>

        {/* Screen Switcher Navigation */}
        <nav
          aria-label="Main Navigation"
          className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm font-medium"
        >
          <button
            id="nav-tab-generator"
            onClick={() => onSelectScreen('generator')}
            aria-current={activeScreen === 'generator' ? 'page' : undefined}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              activeScreen === 'generator'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Idea Generator</span>
          </button>

          <button
            id="nav-tab-mentor"
            onClick={() => onSelectScreen('mentor')}
            aria-current={activeScreen === 'mentor' ? 'page' : undefined}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
              activeScreen === 'mentor'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-zinc-800 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Project Mentor</span>
            {selectedIdeaTitle && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" aria-label="Active project selected" />
            )}
          </button>
        </nav>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            id="theme-toggle-button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition-colors"
            title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
