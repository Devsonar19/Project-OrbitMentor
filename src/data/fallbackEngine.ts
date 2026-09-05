import { ProjectIdea, MentorBlueprint, GenerateResponse, MentorResponse, ChatResponse } from '../types';

/**
 * Deterministic, high-quality fallback generator for Project Ideas.
 * Provides instant results even when offline, quota is exceeded, or when deployed without server.
 */
export function generateFallbackIdeas(domain: string, skills: string[], tier: 'Safe' | 'Applied ML' | 'Super' = 'Safe'): GenerateResponse {
  const cleanDomain = (domain || 'Full-Stack Web & Cloud Systems').trim();
  const domainPrefix = cleanDomain.split('&')[0].trim();
  const safeSkills = skills && skills.length > 0 ? skills : ['React', 'FastAPI', 'PostgreSQL', 'Docker'];

  const ideas: ProjectIdea[] = [
    {
      id: 'idea-1',
      title: `${domainPrefix} Smart Workflow Hub`,
      tier: 'Safe',
      problem: `Small teams and everyday users struggle with fragmented records, manual data entry, and delayed tracking in ${cleanDomain}.`,
      solution: `A clean web dashboard that centralizes operational records, provides automated validation, triggers status alerts, and exports comprehensive weekly summary reports.`,
      recommended_stack: safeSkills.length >= 2 ? [...safeSkills.slice(0, 3), 'PostgreSQL', 'Docker'] : ['React', 'FastAPI', 'PostgreSQL', 'Tailwind CSS'],
      key_features: [
        'Real-time status tracking & search filters',
        'Automated input validation and audit trail',
        'Exportable PDF and Excel project summaries',
        'Responsive dashboard charts with dark mode',
      ],
      feasibility_score: '96% (Safe & Fast to Build)',
      why_good_for_final_year: 'Clean modular code structure, clear relational database entity relationships, and immediate visual demo for external viva examiners.',
    },
    {
      id: 'idea-2',
      title: `${domainPrefix} Semantic Document Assistant`,
      tier: 'Applied ML',
      problem: `Students, researchers, and analysts waste hours manually reading lengthy compliance papers and technical reports in ${cleanDomain}.`,
      solution: `A Retrieval-Augmented Generation (RAG) assistant that indexes uploaded PDFs into a vector database to answer complex queries with direct citation provenance.`,
      recommended_stack: ['FastAPI', 'Python', 'ChromaDB', 'Gemini AI', 'React', 'Docker'],
      key_features: [
        'PDF text chunking and vector embeddings search',
        'Hallucination-guarded answers with exact citations',
        'Interactive question & answer panel with history',
        'Provenance viewer highlighting source paragraphs',
      ],
      feasibility_score: '88% (High Demand & High Score)',
      why_good_for_final_year: 'Directly showcases modern AI engineering without requiring expensive GPU training clusters or long dataset prep.',
    },
    {
      id: 'idea-3',
      title: `High-Reliability Distributed ${domainPrefix} Engine`,
      tier: 'Super',
      problem: `Enterprise systems in ${cleanDomain} face bottlenecks, data synchronization lag, and service failures during unexpected traffic spikes.`,
      solution: `An event-driven microservices architecture that uses asynchronous message queues and worker pools to guarantee zero data loss and automated failover.`,
      recommended_stack: ['Go or FastAPI', 'Redis', 'Kafka / RabbitMQ', 'Docker', 'Next.js'],
      key_features: [
        'Asynchronous event streaming and message queuing',
        'Automated health monitoring with circuit breaker',
        'Sub-50ms query response under concurrent load',
        'Live telemetry, latency percentiles, and throughput metrics',
      ],
      feasibility_score: '78% (Enterprise & Research Grade)',
      why_good_for_final_year: 'Ideal for publishing in academic conferences or demonstrating deep systems engineering to top-tier technical interviewers.',
    },
  ];

  return {
    ideas,
    source: 'orbitmentor-engine',
  };
}

/**
 * Deterministic, high-quality fallback generator for Mentorship Blueprint.
 */
export function generateFallbackBlueprint(
  ideaTitle: string,
  domain: string,
  skills: string[],
  tier: 'Safe' | 'Applied ML' | 'Super' = 'Safe',
  ideaSummary?: string
): MentorResponse {
  const cleanTitle = (ideaTitle || 'Capstone Engineering Project').trim();
  const cleanDomain = (domain || 'Software Engineering').trim();

  const blueprint: MentorBlueprint = {
    project_overview: `A robust, well-scoped capstone project titled "${cleanTitle}" in ${cleanDomain} that solves authentic user pain points with reliable software engineering. ${ideaSummary ? ideaSummary : ''}`.trim(),
    system_architecture_summary: `Structured as a clean 3-tier architecture: a responsive client interface communicating over secure REST API endpoints to a modular backend service, backed by a persistent relational database with caching and background worker tasks.`,
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
  };

  return {
    response: 'Mentorship blueprint generated with OrbitMentor Engine',
    blueprint,
    source: 'orbitmentor-engine',
  };
}

/**
 * Deterministic, high-quality fallback generator for Chat.
 */
export function generateFallbackChat(
  message: string,
  projectTitle: string,
  domain: string,
  skills: string[]
): ChatResponse {
  const cleanTitle = (projectTitle || 'Your Capstone Project').trim();
  const lower = (message || '').toLowerCase();

  let reply = '';
  if (lower.includes('database') || lower.includes('db') || lower.includes('sql') || lower.includes('postgres') || lower.includes('mongo')) {
    reply = `For "${cleanTitle}", PostgreSQL is generally the safest recommendation for university evaluation. External examiners appreciate relational schemas (3NF normalization, foreign keys, and indexes). If your project uses vector search or embeddings, you can easily enable the 'pgvector' extension. What data entities are you planning to store?`;
  } else if (lower.includes('dataset') || lower.includes('data') || lower.includes('download')) {
    reply = `For datasets in ${domain}, check Kaggle (kaggle.com/datasets), Papers With Code, or Hugging Face Hub (huggingface.co/datasets). For final-year projects, examiners look for clean exploratory data analysis (EDA): mention in your report how you cleaned missing values, handled outliers, and split into train/val/test sets.`;
  } else if (lower.includes('viva') || lower.includes('question') || lower.includes('examiner') || lower.includes('external')) {
    reply = `During your viva for "${cleanTitle}", examiners typically ask 3 core questions: 1) "What is the exact novel contribution or practical problem solved?" 2) "Why did you choose this technology over standard alternatives?" and 3) "What happens if 1,000 users access your service at the exact same second?" Be ready with your DFD Level 1 and database ER diagram.`;
  } else if (lower.includes('team') || lower.includes('work') || lower.includes('divide') || lower.includes('member')) {
    reply = `For a 3-4 person team working on "${cleanTitle}", divide responsibilities cleanly: Member 1: Database schema, ORM models, and backend CRUD. Member 2: Core algorithm / AI pipeline / business logic. Member 3: React frontend UI, state management, and API integration. Member 4: Testing, Docker containerization, SRS thesis report, and presentation slides.`;
  } else {
    reply = `Great question regarding "${cleanTitle}"! For an engineering capstone in ${domain}, the most important priority right now is ensuring your core database models and API endpoints are working end-to-end. Once your basic CRUD and data flows are tested on Swagger UI, integrating the frontend and polishing the presentation takes only a couple of days. Would you like sample database schemas or advice on how to test this?`;
  }

  return {
    reply,
    source: 'orbitmentor-engine',
  };
}
