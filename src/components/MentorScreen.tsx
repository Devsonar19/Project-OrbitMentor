import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Layers,
  Calendar,
  Code,
  CheckCircle2,
  HelpCircle,
  Send,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Bot,
  User,
  ArrowRight,
  ArrowDown,
  FileText,
  Award,
  Flag,
  Clock,
} from 'lucide-react';
import { ProjectIdea, MentorBlueprint, ChatMessage } from '../types';

interface MentorScreenProps {
  initialIdea?: ProjectIdea | null;
  initialDomain?: string;
  initialSkills?: string[];
  onBackToGenerator: () => void;
}

export const MentorScreen: React.FC<MentorScreenProps> = ({
  initialIdea,
  initialDomain = 'Healthcare & Telemedicine',
  initialSkills = ['React', 'FastAPI', 'Python', 'PostgreSQL'],
  onBackToGenerator,
}) => {
  const [projectTitle, setProjectTitle] = useState(
    initialIdea?.title || 'Healthcare Smart Telemedicine & AI Assistant'
  );
  const [domain, setDomain] = useState(initialDomain);
  const [skills, setSkills] = useState<string[]>(initialSkills);

  const [blueprint, setBlueprint] = useState<MentorBlueprint | null>(null);
  const [isLoadingBlueprint, setIsLoadingBlueprint] = useState(false);
  const [blueprintSource, setBlueprintSource] = useState<'gemini' | 'orbitmentor-engine' | null>(null);

  // Active section tab: 'comparison' | 'roadmap' | 'modules' | 'chat'
  const [activeTab, setActiveTab] = useState<'comparison' | 'roadmap' | 'modules' | 'chat'>('comparison');

  // Chat state with Real Chat History
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello! I am your Project OrbitMentor. I am ready to guide you through your final-year capstone on "${projectTitle}". Ask me anything about which libraries to use, database schema design, free datasets, or how to tackle professor questions during your final viva!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch or regenerate blueprint
  const fetchBlueprint = async () => {
    setIsLoadingBlueprint(true);
    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea_title: projectTitle,
          domain,
          skills,
          tier: initialIdea?.tier || 'Safe',
          idea_summary: initialIdea?.solution || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to load blueprint: ${response.status}`);
      }

      const data = await response.json();
      if (data.blueprint) {
        setBlueprint(data.blueprint);
        setBlueprintSource(data.source || 'gemini');
      }
    } catch (err) {
      console.error('Error fetching mentor blueprint:', err);
    } finally {
      setIsLoadingBlueprint(false);
    }
  };

  useEffect(() => {
    fetchBlueprint();
  }, [projectTitle, domain]);

  // Scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  // Send Chat Message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isSendingMessage) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSendingMessage(true);

    try {
      const historyPayload = [...chatMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_title: projectTitle,
          domain,
          skills,
          history: historyPayload,
          message: textToSend,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat request failed: ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I'm reviewing your question. Ensure your system architecture has clear module bounds.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I had trouble reaching the AI server. Please try asking again.',
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const sampleQuestions = [
    'Which database is best for my viva evaluation?',
    'What free public datasets can I use for this project?',
    'How should I divide work among 3-4 team members?',
    'What tricky questions will external examiners ask?',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToGenerator}
            className="inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Generator</span>
          </button>
          <span className="text-xs text-slate-400 dark:text-zinc-500">/</span>
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
            Project Mentorship Blueprint
          </span>
        </div>

        {blueprintSource && (
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{blueprintSource === 'gemini' ? 'Gemini 3.8 Flash AI' : 'OrbitMentor Engine'}</span>
          </div>
        )}
      </div>

      {/* Project Overview Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
                {domain}
              </span>
              {initialIdea?.tier && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                  {initialIdea.tier} Tier
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {projectTitle}
            </h1>
          </div>

          <button
            onClick={fetchBlueprint}
            disabled={isLoadingBlueprint}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors flex-shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBlueprint ? 'animate-spin' : ''}`} />
            <span>Regenerate Blueprint</span>
          </button>
        </div>

        {blueprint?.project_overview && (
          <p className="text-sm text-slate-600 dark:text-zinc-300">
            {blueprint.project_overview}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800/60">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 mr-2 self-center">
            Key Stack:
          </span>
          {skills.map((s) => (
            <span
              key={s}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-medium"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation Tabs for Mentor Sections */}
      <div role="tablist" aria-label="Mentor Blueprint Sections" className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
        <button
          role="tab"
          id="tab-comparison"
          aria-selected={activeTab === 'comparison'}
          aria-controls="panel-comparison"
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
            activeTab === 'comparison'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-slate-100 dark:bg-zinc-900'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Which Tech Stack is Better and Why</span>
        </button>

        <button
          role="tab"
          id="tab-roadmap"
          aria-selected={activeTab === 'roadmap'}
          aria-controls="panel-roadmap"
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
            activeTab === 'roadmap'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-slate-100 dark:bg-zinc-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>16-Week Final Year Roadmap</span>
        </button>

        <button
          role="tab"
          id="tab-modules"
          aria-selected={activeTab === 'modules'}
          aria-controls="panel-modules"
          onClick={() => setActiveTab('modules')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
            activeTab === 'modules'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-slate-100 dark:bg-zinc-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Module Breakdown & Architecture</span>
        </button>

        <button
          role="tab"
          id="tab-chat"
          aria-selected={activeTab === 'chat'}
          aria-controls="panel-chat"
          onClick={() => setActiveTab('chat')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
            activeTab === 'chat'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white bg-slate-100 dark:bg-zinc-900'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Real Chat with Mentor</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </div>

      {/* Loading state for Blueprint */}
      {isLoadingBlueprint && !blueprint && (
        <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            Generating custom architectural blueprint using Gemini AI...
          </p>
        </div>
      )}

      {/* TAB 1: Tech Stack Comparison (Which is better and why) */}
      {activeTab === 'comparison' && blueprint && (
        <div className="space-y-6">
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
            <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Technology Decision Rationale</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">
              Examiners and interviewers consistently ask: &quot;Why did you choose this stack over others?&quot; Here are your direct answers backed by engineering trade-offs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blueprint.tech_stack_comparison?.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between shadow-sm space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {item.technology}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                      {item.learning_curve} Curve
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      Alternative Options Considered
                    </span>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                      {item.alternatives}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Why Better For This Project
                    </span>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 mt-0.5 leading-relaxed">
                      {item.why_better}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80">
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-300">
                    <span className="font-bold">Recommendation: </span>
                    {item.verdict}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* System Architecture Summary Box */}
          {blueprint.system_architecture_summary && (
            <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-2 shadow-sm">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Overall System Architecture Summary</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                {blueprint.system_architecture_summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 16-Week Final Year Roadmap with Connecting Arrows and Below Boxes */}
      {activeTab === 'roadmap' && blueprint && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-200 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>16-Week Semester Execution Roadmap</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">
                Sequential progression timeline with connecting milestone arrows and structured task & deliverable boxes below each phase.
              </p>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-center">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-2xs">
                4 Milestone Phases
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                100% Viva Aligned
              </span>
            </div>
          </div>

          {/* Top Sequence Flow Bar with Connecting Horizontal Arrows */}
          <div className="hidden lg:block rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              {blueprint.roadmap_phases?.map((phase, idx) => (
                <React.Fragment key={idx}>
                  {/* Step Node */}
                  <div className="flex items-center space-x-3 group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-indigo-600/25 flex-shrink-0">
                      0{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {phase.timeframe}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[140px]">
                        {idx === 0
                          ? 'Scope & SRS'
                          : idx === 1
                          ? 'Backend & DB'
                          : idx === 2
                          ? 'UI & Integration'
                          : 'Deploy & Viva'}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Arrow Between Steps */}
                  {idx < (blueprint.roadmap_phases?.length || 0) - 1 && (
                    <div className="flex-1 flex items-center justify-center px-3">
                      <div className="w-full h-0.5 bg-slate-200 dark:bg-zinc-800 relative flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shadow-2xs">
                          <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Roadmap Below Boxes Grid with Downward Connecting Arrows */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blueprint.roadmap_phases?.map((phase, idx) => {
              const reviewCheckpoint =
                idx === 0
                  ? '📋 Topic Approval & Synopsis Review'
                  : idx === 1
                  ? '⚙️ Mid-Term Progress Evaluation'
                  : idx === 2
                  ? '💻 Internal Prototype Demonstration'
                  : '🎓 Final External Viva & Thesis Defense';

              const phaseTagColor =
                idx === 0
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : idx === 1
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                  : idx === 2
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';

              return (
                <div key={idx} className="flex flex-col">
                  {/* Downward Connecting Arrow from Top Sequence */}
                  <div className="flex flex-col items-center mb-3">
                    <div className="w-0.5 h-3 bg-indigo-300 dark:bg-indigo-800" />
                    <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shadow-xs">
                      <ArrowDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>

                  {/* Below Box Card */}
                  <div className="flex-1 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative space-y-4">
                    <div className="space-y-3.5">
                      {/* Phase Header */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${phaseTagColor}`}>
                          {phase.timeframe}
                        </span>
                        <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">
                          Phase 0{idx + 1}
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                        {phase.phase_title}
                      </h4>

                      {/* Phase Goal Box */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          Phase Goal
                        </span>
                        <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                          {phase.goal}
                        </p>
                      </div>

                      {/* University Review Checkpoint */}
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 flex items-center space-x-1.5 py-1 px-2 rounded-lg bg-slate-100/70 dark:bg-zinc-800/60">
                        <span>{reviewCheckpoint}</span>
                      </div>

                      {/* Weekly Tasks Checklist */}
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                          Weekly Execution Tasks
                        </span>
                        <div className="space-y-1.5">
                          {phase.tasks?.map((task, tIdx) => (
                            <div
                              key={tIdx}
                              className="flex items-start space-x-2 text-xs text-slate-700 dark:text-zinc-300"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="leading-snug">{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Deliverable Box at Bottom */}
                    <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80">
                      <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                        <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                          <FileText className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Official Deliverable</span>
                        </div>
                        <p className="text-xs font-semibold text-indigo-950 dark:text-indigo-100 leading-snug">
                          {phase.deliverables}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Module Breakdown */}
      {activeTab === 'modules' && blueprint && (
        <div className="space-y-6">
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
            <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Architectural Module Breakdown</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">
              Clean separation of concerns for individual team members, thesis documentation, and system block diagrams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blueprint.modules?.map((mod, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between shadow-sm space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {mod.module_name}
                    </h4>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      Module Purpose
                    </span>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                      {mod.simple_purpose}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Recommended Tech
                    </span>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                      {mod.recommended_tech}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                      Core Responsibilities
                    </span>
                    {mod.key_responsibilities?.map((resp, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-start space-x-1.5 text-xs text-slate-700 dark:text-zinc-300"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Viva Defense & Scoring Tips */}
          {blueprint.viva_defense_tips && blueprint.viva_defense_tips.length > 0 && (
            <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-6 space-y-3">
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300 flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Final Viva Defense & Scoring Advice</span>
              </h4>
              <ul className="space-y-2">
                {blueprint.viva_defense_tips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-amber-950 dark:text-amber-200 flex items-start space-x-2"
                  >
                    <span className="font-bold text-amber-700 dark:text-amber-400">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Real Chat with Mentor (Real Chat History) */}
      {activeTab === 'chat' && (
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950/60 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Interactive Project Mentor
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Powered by Gemini 3.8 Flash • Real conversation history preserved
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                setChatMessages([
                  {
                    id: 'reset-1',
                    role: 'assistant',
                    content: `Chat history cleared. What questions do you have about "${projectTitle}"?`,
                    timestamp: 'Just now',
                  },
                ])
              }
              className="text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white"
            >
              Clear Chat
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {chatMessages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${
                    isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isUser
                        ? 'bg-slate-700 text-white dark:bg-zinc-300 dark:text-zinc-900'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-tl-none whitespace-pre-wrap'
                    }`}
                  >
                    {msg.content}
                    <div
                      className={`text-[10px] mt-1 text-right ${
                        isUser ? 'text-indigo-200' : 'text-slate-400 dark:text-zinc-500'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isSendingMessage && (
              <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-zinc-400 italic">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                <span>Mentor is formulating advice via Gemini AI...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div className="px-4 py-2 bg-slate-50/80 dark:bg-zinc-950/80 border-t border-slate-100 dark:border-zinc-800/80 flex items-center space-x-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 flex-shrink-0">
              Quick Ask:
            </span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isSendingMessage}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-zinc-800 text-xs transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask the mentor a question (e.g., 'How do I test my endpoints?', 'What dataset should I use?')..."
              className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isSendingMessage}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
