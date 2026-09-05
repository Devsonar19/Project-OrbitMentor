import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GeneratorScreen } from './components/GeneratorScreen';
import { MentorScreen } from './components/MentorScreen';
import { ProjectIdea } from './types';
import { Compass, Heart } from 'lucide-react';

export function App() {
  const [activeScreen, setActiveScreen] = useState<'generator' | 'mentor'>('generator');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('orbitmentor_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('Healthcare & Telemedicine');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'React',
    'FastAPI',
    'Python',
    'PostgreSQL',
    'Gemini AI',
  ]);

  // Handle Dark mode class toggle on document and body
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('orbitmentor_theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('orbitmentor_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSelectProjectForMentor = (idea: ProjectIdea, domain: string, skills: string[]) => {
    setSelectedIdea(idea);
    setSelectedDomain(domain);
    setSelectedSkills(skills);
    setActiveScreen('mentor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      {/* Navbar */}
      <Navbar
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        selectedIdeaTitle={selectedIdea?.title}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeScreen === 'generator' ? (
          <GeneratorScreen onSelectProjectForMentor={handleSelectProjectForMentor} />
        ) : (
          <MentorScreen
            initialIdea={selectedIdea}
            initialDomain={selectedDomain}
            initialSkills={selectedSkills}
            onBackToGenerator={() => setActiveScreen('generator')}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200/80 dark:border-zinc-800/80 py-6 px-4 bg-white/50 dark:bg-zinc-950/50 text-center text-xs text-slate-500 dark:text-zinc-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-slate-700 dark:text-zinc-300">
              PROJECT ORBITMENTOR
            </span>
            <span>• Capstone Engineering & Architecture Assistant</span>
          </div>

          <div className="flex items-center space-x-1">
            <span>Crafted for engineering students with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>& Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
