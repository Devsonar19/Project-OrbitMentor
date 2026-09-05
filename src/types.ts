export type GenerationTier = 'Safe' | 'Applied ML' | 'Super';

export interface ProjectIdea {
  id: string;
  title: string;
  tier: GenerationTier;
  problem: string;
  solution: string;
  recommended_stack: string[];
  key_features: string[];
  feasibility_score: string;
  why_good_for_final_year: string;
}

export interface GenerateRequest {
  skills: string[];
  domain: string;
  tier: GenerationTier;
}

export interface GenerateResponse {
  ideas: ProjectIdea[];
  source: 'gemini' | 'orbitmentor-engine';
}

export interface StackComparisonItem {
  technology: string;
  alternatives: string;
  why_better: string;
  learning_curve: 'Easy' | 'Moderate' | 'Steep';
  verdict: string;
}

export interface RoadmapPhase {
  phase_title: string;
  timeframe: string;
  goal: string;
  tasks: string[];
  deliverables: string;
}

export interface ModuleComponent {
  module_name: string;
  simple_purpose: string;
  recommended_tech: string;
  key_responsibilities: string[];
}

export interface MentorBlueprint {
  project_overview: string;
  system_architecture_summary: string;
  tech_stack_comparison: StackComparisonItem[];
  roadmap_phases: RoadmapPhase[];
  modules: ModuleComponent[];
  viva_defense_tips: string[];
}

export interface MentorRequest {
  idea_title: string;
  domain: string;
  skills: string[];
  tier?: GenerationTier;
  idea_summary?: string;
}

export interface MentorResponse {
  response: string;
  blueprint: MentorBlueprint;
  source: 'gemini' | 'orbitmentor-engine';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  project_title: string;
  domain: string;
  skills: string[];
  history: { role: 'user' | 'assistant'; content: string }[];
  message: string;
}

export interface ChatResponse {
  reply: string;
  source: 'gemini' | 'orbitmentor-engine';
}

export interface DomainItem {
  id: string;
  name: string;
  category: string;
  description: string;
  popular: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud & DevOps' | 'AI / ML' | 'Mobile' | 'Cybersecurity' | 'Embedded / IoT';
  popular: boolean;
}
