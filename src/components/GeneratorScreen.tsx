import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  X,
  CheckCircle2,
  Cpu,
  Layers,
  Rocket,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { GenerationTier, ProjectIdea } from '../types';
import { DOMAINS, SKILLS_CATALOG } from '../data/catalog';

interface GeneratorScreenProps {
  onSelectProjectForMentor: (idea: ProjectIdea, domain: string, skills: string[]) => void;
}

export const GeneratorScreen: React.FC<GeneratorScreenProps> = ({ onSelectProjectForMentor }) => {
  // State
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'React',
    'FastAPI',
    'Python',
    'PostgreSQL',
    'Gemini AI',
  ]);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);

  const [selectedDomain, setSelectedDomain] = useState<string>('Healthcare & Telemedicine');
  const [domainSearchQuery, setDomainSearchQuery] = useState('');
  const [isDomainDropdownOpen, setIsDomainDropdownOpen] = useState(false);

  const [selectedTier, setSelectedTier] = useState<GenerationTier>('Safe');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ProjectIdea[]>([]);
  const [dataSource, setDataSource] = useState<'gemini' | 'orbitmentor-engine' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const skillInputRef = useRef<HTMLInputElement>(null);
  const domainInputRef = useRef<HTMLInputElement>(null);

  // Filter skills for autocomplete
  const filteredSkills = SKILLS_CATALOG.filter(
    (skill) =>
      skill.name.toLowerCase().includes(skillSearchQuery.toLowerCase()) &&
      !selectedSkills.some((s) => s.toLowerCase() === skill.name.toLowerCase())
  );

  // Filter domains for autocomplete
  const filteredDomains = DOMAINS.filter(
    (d) =>
      d.name.toLowerCase().includes(domainSearchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(domainSearchQuery.toLowerCase())
  );

  const currentDomainObj = DOMAINS.find((d) => d.name === selectedDomain) || {
    name: selectedDomain,
    category: 'Industry',
    description: 'Custom engineering application domain.',
  };

  const addSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (trimmed && !selectedSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setSkillSearchQuery('');
      setIsSkillDropdownOpen(false);
    }
  };

  const removeSkill = (skillName: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
  };

  const selectDomain = (domainName: string) => {
    setSelectedDomain(domainName);
    setDomainSearchQuery('');
    setIsDomainDropdownOpen(false);
  };

  // Generate Ideas API Call
  const handleGenerate = async () => {
    if (selectedSkills.length === 0) {
      setErrorMessage('Please choose at least one technical skill or tool.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: selectedSkills,
          domain: selectedDomain,
          tier: selectedTier,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error ${response.status}`);
      }

      const data = await response.json();
      if (data.ideas && Array.isArray(data.ideas)) {
        setResults(data.ideas);
        setDataSource(data.source || 'gemini');
      } else {
        throw new Error('Invalid format received from server');
      }
    } catch (err: any) {
      console.error('Failed to generate project ideas:', err);
      setErrorMessage('Unable to connect to AI server. Please retry in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-load default generation on initial view if empty
  useEffect(() => {
    if (results.length === 0 && !isLoading) {
      handleGenerate();
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Hero / Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real Gemini Generative AI Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Generate Final Year Project Ideas
        </h1>
        <p className="text-base text-slate-600 dark:text-zinc-400">
          Select your tech stack and domain to discover 3 targeted capstone ideas tailored for your university evaluation and portfolio.
        </p>
      </div>

      {/* Main Input Config Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Step 1: Tech Stack & Skills Autocomplete */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Skills & Tech Stack
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-zinc-400">
              Type to search or click popular tags below
            </span>
          </div>

          {/* Autocomplete Input */}
          <div className="relative">
            <div className="flex items-center rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                ref={skillInputRef}
                type="text"
                value={skillSearchQuery}
                onChange={(e) => {
                  setSkillSearchQuery(e.target.value);
                  setIsSkillDropdownOpen(true);
                }}
                onFocus={() => setIsSkillDropdownOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && skillSearchQuery.trim()) {
                    e.preventDefault();
                    addSkill(skillSearchQuery);
                  }
                }}
                placeholder="Search tech stack (e.g., React, Python, Docker, PyTorch, Gemini AI)..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none"
              />
              {skillSearchQuery && (
                <button
                  onClick={() => addSkill(skillSearchQuery)}
                  className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              )}
            </div>

            {/* Autocomplete Suggestions Dropdown */}
            {isSkillDropdownOpen && filteredSkills.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-20 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg py-1.5">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  Suggested Technologies
                </div>
                {filteredSkills.slice(0, 10).map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => addSkill(skill.name)}
                    className="w-full text-left px-3.5 py-2 text-sm text-slate-700 dark:text-zinc-200 hover:bg-indigo-50 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors"
                  >
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                      {skill.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Skills Chips */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-500 dark:text-zinc-400">
              Selected stack ({selectedSkills.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 transition-transform hover:scale-105"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-indigo-950 dark:hover:text-white p-0.5"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {selectedSkills.length === 0 && (
                <span className="text-xs text-rose-500 dark:text-rose-400 italic">
                  No skills selected yet. Type above or click below.
                </span>
              )}
            </div>
          </div>

          {/* Quick Add Tech Stack Chips by Category */}
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/60">
            <div className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-2">
              Quick Add Popular Tech:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SKILLS_CATALOG.filter((s) => s.popular && !selectedSkills.includes(s.name))
                .slice(0, 16)
                .map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => addSkill(skill.name)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    <Plus className="w-3 h-3 text-slate-400" />
                    <span>{skill.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Step 2: Target Domain with Autocomplete & Quick Chips */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Project Domain & Industry
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-zinc-400">
              Pick the industry sector you want to solve problems in
            </span>
          </div>

          {/* Domain Autocomplete Input */}
          <div className="relative">
            <div className="flex items-center rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                ref={domainInputRef}
                type="text"
                value={domainSearchQuery}
                onChange={(e) => {
                  setDomainSearchQuery(e.target.value);
                  setIsDomainDropdownOpen(true);
                }}
                onFocus={() => setIsDomainDropdownOpen(true)}
                placeholder="Search domain (e.g., Healthcare, FinTech, EdTech, Climate, AgTech, Cybersecurity)..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none"
              />
            </div>

            {/* Dropdown list of domains */}
            {isDomainDropdownOpen && filteredDomains.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-20 max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg py-1.5">
                {filteredDomains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => selectDomain(domain.name)}
                    className="w-full text-left px-3.5 py-2 text-sm text-slate-700 dark:text-zinc-200 hover:bg-indigo-50 dark:hover:bg-zinc-800 transition-colors flex items-start justify-between"
                  >
                    <div>
                      <div className="font-semibold">{domain.name}</div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-1">
                        {domain.description}
                      </div>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 flex-shrink-0 ml-2">
                      {domain.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Domain Select Chips */}
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((domain) => {
              const isSelected = selectedDomain === domain.name;
              return (
                <button
                  key={domain.id}
                  onClick={() => selectDomain(domain.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {domain.name}
                </button>
              );
            })}
          </div>

          {/* Active Domain Info Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 flex items-start space-x-3">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Selected Domain: {currentDomainObj.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                  {currentDomainObj.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                {currentDomainObj.description}
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Complexity Tier Selection */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Choose Complexity Tier
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Safe Tier */}
            <div
              onClick={() => setSelectedTier('Safe')}
              className={`cursor-pointer rounded-xl p-4 border transition-all relative flex flex-col justify-between ${
                selectedTier === 'Safe'
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Safe</h3>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                    Fast & Easy
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Fast, easy to build within a single semester. Uses standard, battle-tested web/mobile stacks.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                <span>Feasibility: 95%+</span>
                <span>Risk: Low</span>
              </div>
            </div>

            {/* Applied ML Tier */}
            <div
              onClick={() => setSelectedTier('Applied ML')}
              className={`cursor-pointer rounded-xl p-4 border transition-all relative flex flex-col justify-between ${
                selectedTier === 'Applied ML'
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-indigo-500" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Applied ML</h3>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300">
                    ML & RAG
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Uses ML, RAGs, vector search, and AI workflows. High student scoring potential with practical tools.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                <span>Feasibility: 88%</span>
                <span>Risk: Balanced</span>
              </div>
            </div>

            {/* Super Tier */}
            <div
              onClick={() => setSelectedTier('Super')}
              className={`cursor-pointer rounded-xl p-4 border transition-all relative flex flex-col justify-between ${
                selectedTier === 'Super'
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <Rocket className="w-4 h-4 text-violet-500" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Super</h3>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded font-semibold bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300">
                    High Complexity
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  High complexity, enterprise-grade distributed systems or novel research suitable for publication.
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
                <span>Feasibility: 75%</span>
                <span>Risk: Research</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            id="generate-ideas-button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/25 transition-all hover:shadow-indigo-600/40"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Projects via Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Project Ideas ({selectedTier} Tier)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section - Single Selected Tier Blueprint in Full Detail */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored Project Blueprint</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Generated Project Blueprint
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Showing detailed specifications for the selected <span className="font-semibold text-slate-700 dark:text-zinc-200">{selectedTier}</span> tier. Switch tiers anytime to explore alternative project depths.
            </p>
          </div>

          {dataSource && (
            <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 self-start sm:self-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {dataSource === 'gemini' ? 'Gemini 3.8 Flash Engine' : 'OrbitMentor Engine'}
              </span>
            </div>
          )}
        </div>

        {/* Tier Selector Bar for Results */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60">
          <button
            onClick={() => setSelectedTier('Safe')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedTier === 'Safe'
                ? 'bg-white dark:bg-zinc-900 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-emerald-800/60'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Safe Tier</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-semibold">
              96% Feasible
            </span>
          </button>

          <button
            onClick={() => setSelectedTier('Applied ML')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedTier === 'Applied ML'
                ? 'bg-white dark:bg-zinc-900 text-indigo-700 dark:text-indigo-400 shadow-sm border border-indigo-200 dark:border-indigo-800/60'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>Applied ML Tier</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100/80 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 font-semibold">
              88% Feasible
            </span>
          </button>

          <button
            onClick={() => setSelectedTier('Super')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedTier === 'Super'
                ? 'bg-white dark:bg-zinc-900 text-violet-700 dark:text-violet-400 shadow-sm border border-violet-200 dark:border-violet-800/60'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Rocket className="w-4 h-4 text-violet-500" />
            <span>Super Tier</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100/80 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300 font-semibold">
              78% Feasible
            </span>
          </button>
        </div>

        {/* Detailed Single Blueprint Display */}
        {(() => {
          const activeIdea =
            results.find((item) => item.tier.toLowerCase() === selectedTier.toLowerCase()) ||
            results[0];

          if (!activeIdea) {
            return (
              <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  No blueprint generated yet. Click &quot;Generate Project Ideas&quot; above to begin.
                </p>
              </div>
            );
          }

          const tierColor =
            activeIdea.tier === 'Safe'
              ? {
                  badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60',
                  icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
                  border: 'border-emerald-200/80 dark:border-emerald-900/50',
                  accent: 'text-emerald-600 dark:text-emerald-400',
                  pill: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
                }
              : activeIdea.tier === 'Applied ML'
              ? {
                  badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60',
                  icon: <Cpu className="w-5 h-5 text-indigo-500" />,
                  border: 'border-indigo-200/80 dark:border-indigo-900/50',
                  accent: 'text-indigo-600 dark:text-indigo-400',
                  pill: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
                }
              : {
                  badge: 'bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60',
                  icon: <Rocket className="w-5 h-5 text-violet-500" />,
                  border: 'border-violet-200/80 dark:border-violet-900/50',
                  accent: 'text-violet-600 dark:text-violet-400',
                  pill: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300',
                };

          return (
            <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-8 relative overflow-hidden">
              {/* Header with Badges */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${tierColor.badge}`}>
                      {tierColor.icon}
                      <span>{activeIdea.tier} Complexity Tier</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                      {selectedDomain}
                    </span>

                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                      ⏱ 14 - 16 Weeks (1 Semester)
                    </span>
                  </div>

                  <div className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {activeIdea.feasibility_score}
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {activeIdea.title}
                </h3>
              </div>

              {/* Problem & Solution Detailed Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {/* Problem Statement Box */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50 p-5 space-y-2.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                      Real-World Problem Statement
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                    {activeIdea.problem}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 pt-1">
                    Addresses authentic operational friction in {selectedDomain}, ensuring examiners immediately recognize the practical need and commercial relevance.
                  </p>
                </div>

                {/* Software Solution Box */}
                <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50 p-5 space-y-2.5">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                      Software Architecture & Solution
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                    {activeIdea.solution}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 pt-1">
                    Structured with clear boundaries between user client interfaces, business logic API services, and high-integrity storage.
                  </p>
                </div>
              </div>

              {/* Recommended Stack Detailed Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Recommended Technical Stack
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Matched with your skills: {selectedSkills.slice(0, 3).join(', ')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeIdea.recommended_stack?.map((tech) => (
                    <div
                      key={tech}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 shadow-2xs flex items-center space-x-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Features & Deliverables Checklist */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Core Implementation Features (Demo Requirements)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeIdea.key_features?.map((feature, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-3.5 rounded-xl border border-slate-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-start space-x-2.5 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                          {feature}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                          Verifiable test component for milestone reviews.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Viva Defense & External Examiner Scoring Callout */}
              {activeIdea.why_good_for_final_year && (
                <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Academic Viva & Evaluation Rubric Advantage</span>
                  </div>
                  <p className="text-xs text-indigo-950/90 dark:text-indigo-200/90 leading-relaxed">
                    {activeIdea.why_good_for_final_year}
                  </p>
                </div>
              )}

              {/* Card Footer & Prominent Open in Mentor Action */}
              <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 dark:text-zinc-400 text-center sm:text-left">
                  Explore tech stack trade-offs, step-by-step 16-week execution plan, and interactive AI mentoring.
                </div>

                <button
                  id="open-in-mentor-button"
                  onClick={() => onSelectProjectForMentor(activeIdea, selectedDomain, selectedSkills)}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Open in Project Mentor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
