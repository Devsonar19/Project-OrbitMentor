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
import { generateFallbackIdeas, generateFallbackBlueprint, generateFallbackChat } from '../data/fallbackEngine';

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
  const fallbackResult = generateFallbackIdeas(req.domain, req.skills, req.tier);
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
  const fallbackBlueprint = generateFallbackBlueprint(
    req.idea_title,
    req.domain,
    req.skills,
    req.tier,
    req.idea_summary
  );

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
  return generateFallbackChat(req.message, req.project_title, req.domain, req.skills);
}
