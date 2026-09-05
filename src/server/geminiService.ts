import { GoogleGenAI } from '@google/genai';
import {
  GenerateRequest,
  GenerateResponse,
  MentorRequest,
  MentorResponse,
  ChatRequest,
  ChatResponse,
  ProjectIdea,
  MentorBlueprint,
} from '../types';
import { MemoryCache } from './cache';
import { validateGenerateRequest, validateMentorRequest, validateChatRequest } from './validation';

// Caches for fast response times and token efficiency
const ideasCache = new MemoryCache<GenerateResponse>(100, 600); // 10 min TTL
const blueprintCache = new MemoryCache<MentorResponse>(100, 600); // 10 min TTL

// Lazy initialized Gemini client
let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Handles project ideas generation with input validation, caching, and Gemini AI.
 */
export async function handleGenerateIdeas(rawReq: unknown): Promise<GenerateResponse> {
  const validation = validateGenerateRequest(rawReq);
  const req = validation.data || {
    domain: 'Full-Stack Web & Cloud Systems',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    tier: 'Safe',
  };

  const cacheKey = MemoryCache.createKey('ideas', {
    domain: req.domain,
    skills: req.skills.sort().join(','),
  });

  // Check cache for sub-50ms instant response
  const cached = ideasCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const client = getGeminiClient();
  const skillsList = req.skills.join(', ');

  if (client) {
    try {
      const prompt = `You are PROJECT ORBITMENTOR, a friendly, pragmatic technical mentor for university final-year engineering students.
Generate 3 distinct, practical, and highly realistic capstone project ideas for:
- Domain: ${req.domain}
- Student Skills: ${skillsList}
- Currently Selected Tier: ${req.tier}

Generate exactly 3 project ideas, one for each complexity tier:
1. "Safe": Fast and practical to finish in 1 semester using standard web/mobile production stack. High feasibility (95%+).
2. "Applied ML": Applied machine learning, RAG (Retrieval-Augmented Generation), vector search, computer vision, or AI agent workflow. High student scoring potential (88%).
3. "Super": Enterprise-grade distributed systems, microservices, high concurrency, or research-grade architecture (75%).

Rules:
1. Use clear, simple everyday English. Avoid pretentious academic buzzwords.
2. Ensure problems are tangible and software solutions can genuinely be built by students.
3. Provide rich, detailed explanations for problem, solution, categorized tech stack, 4 core features, and viva defense advantages.
4. Return ONLY a valid JSON object matching this schema:
{
  "ideas": [
    {
      "id": "idea-safe",
      "title": "Clear Safe Project Title",
      "tier": "Safe",
      "problem": "Detailed 2-sentence real-world problem statement.",
      "solution": "Detailed 3-sentence software architecture and solution explaining how it works.",
      "recommended_stack": ["React", "FastAPI", "PostgreSQL", "Tailwind CSS", "Docker"],
      "key_features": ["Core Feature 1", "Core Feature 2", "Core Feature 3", "Core Feature 4"],
      "feasibility_score": "96% (Safe & Fast to Build)",
      "why_good_for_final_year": "Exact reasons external examiners and professors will award high scores during viva defense."
    },
    {
      "id": "idea-ml",
      "title": "Clear Applied ML Project Title",
      "tier": "Applied ML",
      "problem": "Detailed 2-sentence real-world problem statement.",
      "solution": "Detailed 3-sentence software architecture and solution explaining how it works.",
      "recommended_stack": ["FastAPI", "Python", "ChromaDB", "Gemini AI", "React", "Docker"],
      "key_features": ["Core Feature 1", "Core Feature 2", "Core Feature 3", "Core Feature 4"],
      "feasibility_score": "88% (High Demand & High Score)",
      "why_good_for_final_year": "Exact reasons external examiners and professors will award high scores during viva defense."
    },
    {
      "id": "idea-super",
      "title": "Clear Super Project Title",
      "tier": "Super",
      "problem": "Detailed 2-sentence real-world problem statement.",
      "solution": "Detailed 3-sentence software architecture and solution explaining how it works.",
      "recommended_stack": ["Go or FastAPI", "Kafka or Redis", "Docker", "PostgreSQL", "Next.js"],
      "key_features": ["Core Feature 1", "Core Feature 2", "Core Feature 3", "Core Feature 4"],
      "feasibility_score": "78% (Enterprise & Research Grade)",
      "why_good_for_final_year": "Exact reasons external examiners and professors will award high scores during viva defense."
    }
  ]
}`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        if (parsed?.ideas && Array.isArray(parsed.ideas) && parsed.ideas.length >= 3) {
          const result: GenerateResponse = {
            ideas: parsed.ideas,
            source: 'gemini',
          };
          ideasCache.set(cacheKey, result);
          return result;
        }
      }
    } catch (err) {
      console.error('Gemini generateContent error in handleGenerateIdeas:', err);
    }
  }

  // High-quality, realistic fallback ideas
  const domainPrefix = req.domain.split('&')[0].trim();
  const ideas: ProjectIdea[] = [
    {
      id: 'idea-1',
      title: `${domainPrefix} Smart Workflow Hub`,
      tier: 'Safe',
      problem: `Small teams and everyday users struggle with fragmented records and delayed tracking in ${req.domain}.`,
      solution: `A clean web dashboard that centralizes operational logs, provides status alerts, and exports weekly summary reports.`,
      recommended_stack: req.skills.length >= 2 ? [...req.skills.slice(0, 3), 'PostgreSQL', 'Docker'] : ['React', 'FastAPI', 'PostgreSQL', 'Tailwind CSS'],
      key_features: ['Real-time status tracking', 'Automated data validation', 'Exportable PDF/Excel project summaries', 'Interactive dashboard charts'],
      feasibility_score: '96% (Safe & Fast to Build)',
      why_good_for_final_year: 'Clean modular code structure, clear database entity relationships, and immediate visual demo for examiners.',
    },
    {
      id: 'idea-2',
      title: `${domainPrefix} Semantic Document Assistant`,
      tier: 'Applied ML',
      problem: `Students and analysts waste hours manually reading lengthy compliance papers and reports in ${req.domain}.`,
      solution: `A Retrieval-Augmented Generation (RAG) assistant that indexes uploaded PDFs into a vector database to answer queries with direct citations.`,
      recommended_stack: ['FastAPI', 'Python', 'ChromaDB', 'Gemini AI', 'React', 'Docker'],
      key_features: ['PDF text chunking and vector search', 'Hallucination-guarded answers with citations', 'Interactive question & answer panel', 'Citation provenance viewer'],
      feasibility_score: '88% (High Demand & High Score)',
      why_good_for_final_year: 'Directly showcases modern AI engineering without requiring expensive GPU training clusters.',
    },
    {
      id: 'idea-3',
      title: `High-Reliability Distributed ${domainPrefix} Engine`,
      tier: 'Super',
      problem: `Enterprise systems in ${req.domain} face bottlenecks, data synchronization lag, and service failures during peak load.`,
      solution: `An event-driven microservices architecture that uses asynchronous queues and worker pools to guarantee zero data loss and automated failover.`,
      recommended_stack: ['Go or FastAPI', 'Redis', 'Kafka / RabbitMQ', 'Docker', 'Next.js'],
      key_features: ['Asynchronous event streaming pipeline', 'Automated health monitoring & circuit breaker', 'Sub-50ms query response under heavy load', 'Live telemetry and throughput dashboard'],
      feasibility_score: '78% (Enterprise & Research Grade)',
      why_good_for_final_year: 'Ideal for publishing in academic conferences or demonstrating deep systems engineering to top-tier tech interviewers.',
    },
  ];

  const fallbackResult: GenerateResponse = {
    ideas,
    source: 'orbitmentor-engine',
  };
  ideasCache.set(cacheKey, fallbackResult);
  return fallbackResult;
}

/**
 * Handles comprehensive mentorship blueprint generation.
 */
export async function handleMentorBlueprint(rawReq: unknown): Promise<MentorResponse> {
  const validation = validateMentorRequest(rawReq);
  const req = validation.data || {
    idea_title: 'Engineering Capstone Project',
    domain: 'Computer Science',
    skills: ['React', 'FastAPI'],
    tier: 'Safe',
  };

  const cacheKey = MemoryCache.createKey('blueprint', {
    title: req.idea_title,
    domain: req.domain,
    tier: req.tier,
  });

  const cached = blueprintCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const client = getGeminiClient();
  const skillsList = req.skills.join(', ');

  if (client) {
    try {
      const prompt = `You are PROJECT ORBITMENTOR, a senior principal software architect mentoring an engineering student on their capstone project.
Project Title: "${req.idea_title}"
Domain: "${req.domain}"
Skills: "${skillsList}"
Tier: "${req.tier || 'Safe'}"
Summary: "${req.idea_summary || ''}"

Produce a complete, practical, and comprehensive mentorship blueprint in simple, student-friendly terms (NO heavy academic jargon!).

Include:
1. Simple Project Overview (2 clear sentences)
2. Simple System Architecture Summary (explain client, backend, database and external APIs)
3. Tech Stack Comparison: Compare 3 major technology decisions (e.g. FastAPI vs Express, PostgreSQL vs MongoDB, React vs Flutter) explaining in plain English why one is better for this specific project, learning curve, and clear verdict.
4. Final Year 16-Week Roadmap: Divided into 4 distinct phases (Weeks 1-4 Research & SRS, Weeks 5-8 Backend & DB, Weeks 9-12 Frontend & Integration, Weeks 13-16 Testing, Deployment & Viva Prep).
5. Module Breakdown: 3-4 distinct architectural components with simple purpose, recommended tech, and responsibilities.
6. Viva Defense Tips: 3-4 golden tips on how to confidently answer external professor questions.

Return ONLY a valid JSON object matching this schema:
{
  "project_overview": "...",
  "system_architecture_summary": "...",
  "tech_stack_comparison": [
    {
      "technology": "e.g. FastAPI (Python) vs Express (Node.js)",
      "alternatives": "e.g. Django, Flask",
      "why_better": "...",
      "learning_curve": "Easy" | "Moderate" | "Steep",
      "verdict": "..."
    }
  ],
  "roadmap_phases": [
    {
      "phase_title": "...",
      "timeframe": "Weeks 1 - 4",
      "goal": "...",
      "tasks": ["Task 1", "Task 2", "Task 3"],
      "deliverables": "..."
    }
  ],
  "modules": [
    {
      "module_name": "...",
      "simple_purpose": "...",
      "recommended_tech": "...",
      "key_responsibilities": ["Responsibility 1", "Responsibility 2"]
    }
  ],
  "viva_defense_tips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ]
}`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text?.trim();
      if (text) {
        const blueprint = JSON.parse(text) as MentorBlueprint;
        const result: MentorResponse = {
          response: 'Mentorship blueprint generated with Gemini AI',
          blueprint,
          source: 'gemini',
        };
        blueprintCache.set(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.error('Gemini mentor error in handleMentorBlueprint:', err);
    }
  }

  // High quality fallback blueprint
  const fallbackBlueprint: MentorResponse = {
    response: 'Mentorship blueprint generated with OrbitMentor Engine',
    source: 'orbitmentor-engine',
    blueprint: {
      project_overview: `A robust, well-scoped capstone project in ${req.domain} that solves authentic user pain points with reliable software engineering.`,
      system_architecture_summary: `Structured as a clean 3-tier architecture: a responsive client interface communicating over secure REST API endpoints to a modular backend service, backed by a persistent relational database with caching.`,
      tech_stack_comparison: [
        {
          technology: 'FastAPI (Python) vs Express.js (Node.js)',
          alternatives: 'Django, Flask, Spring Boot',
          why_better: 'FastAPI generates automatic Swagger UI documentation (professors love this during demonstrations), provides built-in Pydantic validation, and makes integrating AI/ML models frictionless.',
          learning_curve: 'Moderate',
          verdict: 'Recommended: Best choice for clean API schemas and painless ML libraries integration.',
        },
        {
          technology: 'PostgreSQL vs MongoDB',
          alternatives: 'MySQL, SQLite',
          why_better: 'PostgreSQL guarantees strict relational integrity (ACID), handles complex multi-table queries cleanly, and supports pgvector if semantic search is added later.',
          learning_curve: 'Moderate',
          verdict: 'Recommended: Solid database credibility that impresses technical examiners.',
        },
        {
          technology: 'React + Vite vs Flutter Web',
          alternatives: 'Next.js, Vue.js',
          why_better: 'React with Vite offers instant compilation, zero bundle bloat, and smooth browser rendering without mobile rendering engine emulation overhead.',
          learning_curve: 'Easy',
          verdict: 'Recommended: Fast turnaround for web dashboards with zero friction.',
        },
      ],
      roadmap_phases: [
        {
          phase_title: 'Phase 1: Project Scope, SRS & Architecture Design',
          timeframe: 'Weeks 1 - 4',
          goal: 'Lock in problem definition, complete literature review, write Software Requirements Specification (SRS), and draft UML diagrams.',
          tasks: [
            'Define functional and non-functional requirements with your project guide',
            'Draw Data Flow Diagrams (DFD Level 0, 1) and Database ER Diagrams',
            'Initialize Git repository, configure .gitignore, and setup folder structure',
          ],
          deliverables: 'Approved Project Proposal Document & Initial Wireframes',
        },
        {
          phase_title: 'Phase 2: Database Schema & Backend Core APIs',
          timeframe: 'Weeks 5 - 8',
          goal: 'Build the relational database models, initialize migrations, and implement essential CRUD API routes.',
          tasks: [
            'Create database tables with proper foreign key constraints and indexes',
            'Implement REST endpoints with Pydantic request/response schemas',
            'Verify all endpoints locally using Swagger UI documentation',
          ],
          deliverables: 'Working backend service verified with automated test calls',
        },
        {
          phase_title: 'Phase 3: Frontend Interface & End-to-End Integration',
          timeframe: 'Weeks 9 - 12',
          goal: 'Develop interactive user screens, connect API calls, and handle loading and error states.',
          tasks: [
            'Build responsive UI with light/dark theme support and simple typography',
            'Wire frontend forms and search filters directly to backend endpoints',
            'Add toast notifications and graceful offline/error fallback messages',
          ],
          deliverables: 'Complete working application prototype ready for user testing',
        },
        {
          phase_title: 'Phase 4: Optimization, Deployment & Viva Defense Preparation',
          timeframe: 'Weeks 13 - 16',
          goal: 'Deploy to cloud hosting, prepare presentation slide deck, and rehearse project defense.',
          tasks: [
            'Deploy backend to cloud (Render / Cloud Run) and frontend to Vercel or static host',
            'Benchmark API response times and write test report documentation',
            'Conduct mock viva sessions addressing common examiner critique questions',
          ],
          deliverables: 'Live Public URL, Final Project Report Thesis & Viva Slide Deck',
        },
      ],
      modules: [
        {
          module_name: 'Client Interface & State Store',
          simple_purpose: 'Allows students and users to interact with features, filter records, and toggle views smoothly.',
          recommended_tech: 'React + TypeScript + Tailwind CSS',
          key_responsibilities: ['Fast client-side routing', 'Search autocomplete', 'Light/Dark visual theme'],
        },
        {
          module_name: 'Core API & Business Logic Service',
          simple_purpose: 'Validates incoming payloads, executes algorithms, and returns structured data.',
          recommended_tech: 'FastAPI + Pydantic (or Node.js)',
          key_responsibilities: ['Endpoint routing', 'Input schema sanitization', 'AI service orchestration'],
        },
        {
          module_name: 'Data Persistence & Storage Layer',
          simple_purpose: 'Safely records user activities, system records, and project states.',
          recommended_tech: 'PostgreSQL (or SQLite for local dev)',
          key_responsibilities: ['Data consistency', 'Indexing for sub-second queries', 'Backup snapshots'],
        },
      ],
      viva_defense_tips: [
        'Clearly state the REAL-WORLD problem first: Examiners care far more about WHY you built this than how many fancy libraries you imported.',
        'Justify your tech stack choices using engineering trade-offs (e.g. "We chose PostgreSQL over MongoDB because our user data has strict relational constraints").',
        'Have Swagger UI and database tables open in separate tabs so you can instantly show working data flow when asked.',
        'Acknowledge limitations honestly: If asked about scaling or security, describe the exact step you would take in Phase 2.',
      ],
    },
  };

  blueprintCache.set(cacheKey, fallbackBlueprint);
  return fallbackBlueprint;
}

/**
 * Handles real-time interactive technical mentorship chat.
 */
export async function handleMentorChat(rawReq: unknown): Promise<ChatResponse> {
  const validation = validateChatRequest(rawReq);
  const req = validation.data || {
    message: 'How should I start my project?',
    project_title: 'Capstone Project',
    domain: 'Software Engineering',
    skills: ['React', 'Node.js'],
    history: [],
  };

  const client = getGeminiClient();

  if (client) {
    try {
      const historyContext = req.history
        ?.slice(-8)
        ?.map((msg) => `${msg.role === 'user' ? 'Student' : 'Mentor'}: ${msg.content}`)
        .join('\n\n') || '';

      const prompt = `You are PROJECT ORBITMENTOR, an experienced, encouraging software engineering mentor helping an undergraduate final-year student.
Project Context:
- Title: ${req.project_title}
- Domain: ${req.domain}
- Stack: ${req.skills.join(', ')}

Recent Conversation History:
${historyContext}

Student's Latest Question:
"${req.message}"

Mentor Instructions:
1. Answer directly and concisely in simple, clear, student-friendly English.
2. Provide concrete recommendations (e.g. specific free datasets, specific Python/JS code patterns, database table designs, or examiner viva questions).
3. If giving advice, keep it actionable and practical for university project deadlines.
4. Keep the tone friendly, supportive, and professional.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      const reply = response.text?.trim();
      if (reply) {
        return {
          reply,
          source: 'gemini',
        };
      }
    } catch (err) {
      console.error('Gemini chat error in handleMentorChat:', err);
    }
  }

  // High quality context-aware fallback response
  return {
    reply: `Great question regarding "${req.project_title}"! For an engineering capstone, the most important priority right now is ensuring your core database models and API endpoints are working end-to-end. Once your basic CRUD and data flows are tested on Swagger UI, integrating the frontend and polishing the presentation takes only a couple of days. Would you like sample database schemas or advice on how to test this?`,
    source: 'orbitmentor-engine',
  };
}
