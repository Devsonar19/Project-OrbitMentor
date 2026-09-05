"""
PROJECT ORBITMENTOR - FastAPI Backend Service
AI-powered Capstone Project Generator & Engineering Mentor
"""

import os
import json
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import (
    GenerateRequest,
    GenerateResponse,
    ProjectIdea,
    MentorRequest,
    MentorResponse,
    MentorBlueprint,
    StackComparisonItem,
    RoadmapPhase,
    ModuleComponent,
    ChatRequest,
    ChatResponse,
)

load_dotenv()

app = FastAPI(
    title="PROJECT ORBITMENTOR API",
    description="Backend API powering AI Project Idea Generation and Mentorship for Engineering Students",
    version="2.0.0"
)

# Enable CORS for web frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Optional Python GenAI initialization if installed
genai_client = None
if GEMINI_API_KEY:
    try:
        from google import genai
        genai_client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        print(f"Google GenAI initialization warning: {e}")


@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "app": "PROJECT ORBITMENTOR",
        "ai_configured": bool(GEMINI_API_KEY)
    }


@app.get("/api/domains")
async def get_domains():
    """Returns curated domains with sample metadata for autocomplete."""
    return [
        {"name": "Healthcare & Telemedicine", "category": "HealthTech", "popular": True},
        {"name": "Fintech & Smart Payments", "category": "Finance", "popular": True},
        {"name": "EdTech & Learning Platforms", "category": "Education", "popular": True},
        {"name": "Climate & CleanTech", "category": "Environment", "popular": True},
        {"name": "Smart Agriculture & AgTech", "category": "Agriculture", "popular": False},
        {"name": "Cybersecurity & Identity", "category": "Security", "popular": True},
        {"name": "Supply Chain & Logistics", "category": "Enterprise", "popular": False},
        {"name": "Autonomous Vehicles & Robotics", "category": "Robotics", "popular": False},
        {"name": "E-Commerce & Smart Retail", "category": "Retail", "popular": True},
        {"name": "Social Good & Accessibility", "category": "Civic", "popular": False},
        {"name": "Space & Satellite Tech", "category": "Aerospace", "popular": False},
        {"name": "IoT & Smart Cities", "category": "Embedded", "popular": True}
    ]


@app.get("/api/skills")
async def get_skills():
    """Returns comprehensive tech stack skills for autocomplete."""
    return [
        {"name": "Python", "category": "Backend"},
        {"name": "FastAPI", "category": "Backend"},
        {"name": "Node.js", "category": "Backend"},
        {"name": "Go", "category": "Backend"},
        {"name": "React", "category": "Frontend"},
        {"name": "Next.js", "category": "Frontend"},
        {"name": "Flutter", "category": "Mobile"},
        {"name": "PostgreSQL", "category": "Database"},
        {"name": "MongoDB", "category": "Database"},
        {"name": "Redis", "category": "Database"},
        {"name": "Docker", "category": "DevOps"},
        {"name": "Kubernetes", "category": "DevOps"},
        {"name": "PyTorch", "category": "AI / ML"},
        {"name": "TensorFlow", "category": "AI / ML"},
        {"name": "Gemini AI", "category": "AI / ML"},
        {"name": "LangChain", "category": "AI / ML"},
        {"name": "OpenCV", "category": "Computer Vision"},
        {"name": "AWS", "category": "Cloud"},
        {"name": "Firebase", "category": "Cloud"}
    ]


@app.post("/api/generate", response_model=GenerateResponse)
async def generate_ideas(req: GenerateRequest):
    """Generates 3 tailored project ideas across complexity tiers."""
    skills_str = ", ".join(req.skills) if req.skills else "Modern full-stack technologies"
    tier_desc = {
        "Safe": "Fast, high feasibility, battle-tested standard web/mobile stack, easy to build within a semester.",
        "Applied ML": "Modern ML workflows, RAG (Retrieval-Augmented Generation), vector databases, or agent pipelines.",
        "Super": "High complexity, enterprise-ready, distributed systems, research-grade, suitable for paper publication."
    }.get(req.tier, "Balanced student capstone")

    if genai_client:
        try:
            prompt = f"""You are PROJECT ORBITMENTOR, a practical mentor for final year engineering students.
Generate 3 distinct, creative, and realistic capstone project ideas for:
- Domain: {req.domain}
- Student Skills: {skills_str}
- Complexity Tier: {req.tier} ({tier_desc})

Requirements:
1. Explain in simple, clear language (no unnecessarily complex jargon).
2. Give concrete solutions and recommended tools.
3. Return ONLY valid JSON in this exact structure:
{{
  "ideas": [
    {{
      "id": "idea-1",
      "title": "Clear Project Title",
      "tier": "{req.tier}",
      "problem": "Real-world problem being solved (2 sentences max)",
      "solution": "Practical software solution (2-3 sentences)",
      "recommended_stack": ["Tool 1", "Tool 2", "Tool 3", "Tool 4"],
      "key_features": ["Feature 1", "Feature 2", "Feature 3"],
      "feasibility_score": "95%",
      "why_good_for_final_year": "Why professors and recruiters will appreciate this project"
    }}
  ]
}}"""
            response = genai_client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            raw = json.loads(response.text)
            return GenerateResponse(ideas=raw["ideas"], source="gemini")
        except Exception as err:
            print(f"Gemini API error in generate: {err}")

    # High quality fallback ideas when API key is not supplied
    prefix = req.domain.split("&")[0].strip()
    return GenerateResponse(
        source="orbitmentor-engine",
        ideas=[
            ProjectIdea(
                id="idea-1",
                title=f"{prefix} Smart Assistance Hub",
                tier=req.tier,
                problem=f"Students and small teams often lack real-time visibility and automated tracking in {req.domain}.",
                solution=f"A streamlined dashboard built with {skills_str} delivering automated alerts, live metrics, and clean user interaction.",
                recommended_stack=req.skills[:3] + ["PostgreSQL", "Docker"] if req.skills else ["React", "FastAPI", "PostgreSQL"],
                key_features=["Interactive live analytics", "Automated anomaly detection", "Role-free quick team dashboard"],
                feasibility_score="95% (Safe & Deliverable)",
                why_good_for_final_year="Demonstrates end-to-end full stack architecture, clean database normalization, and robust API endpoints."
            ),
            ProjectIdea(
                id="idea-2",
                title=f"Intelligent {prefix} RAG Knowledge Navigator",
                tier="Applied ML",
                problem=f"Domain experts spend hours manually sifting through complex guidelines and unstructured documents in {req.domain}.",
                solution=f"A retrieval-augmented question answering engine that indexes domain PDFs and provides cited, verified answers.",
                recommended_stack=["FastAPI", "Gemini AI", "LangChain", "ChromaDB", "React"],
                key_features=["Semantic document search", "Source citation preview", "Chat-based query exploration"],
                feasibility_score="88% (High Demand)",
                why_good_for_final_year="Highlights cutting-edge Generative AI and vector search without needing massive GPU training infrastructure."
            ),
            ProjectIdea(
                id="idea-3",
                title=f"Decentralized High-Throughput {prefix} Pipeline",
                tier="Super",
                problem=f"Enterprise {req.domain} systems struggle with single points of failure and unpredictable latency spikes.",
                solution=f"A resilient event-driven microservices architecture using asynchronous message streaming, worker nodes, and fault recovery.",
                recommended_stack=["Go / FastAPI", "Kafka / RabbitMQ", "Docker", "Prometheus", "Next.js"],
                key_features=["Distributed event streaming", "Circuit breaker fault tolerance", "Automated failover and metrics"],
                feasibility_score="75% (Research / Enterprise)",
                why_good_for_final_year="Perfect for showing advanced systems engineering, scalability benchmarks, and publication-ready results."
            )
        ]
    )


@app.post("/api/mentor", response_model=MentorResponse)
async def mentor_blueprint(req: MentorRequest):
    """Provides architectural mentorship: stack rationale, 16-week roadmap, and module breakdown."""
    skills_str = ", ".join(req.skills) if req.skills else "Standard tech stack"

    if genai_client:
        try:
            prompt = f"""You are PROJECT ORBITMENTOR, a senior software architect guiding a student through their capstone project.
Project Title: '{req.idea_title}'
Domain: '{req.domain}'
Student Skills: {skills_str}
Tier: {req.tier}

Generate a comprehensive, simple, and encouraging technical blueprint.
Do NOT use overly complicated academic jargon. Keep it practical, clear, and actionable.

Return ONLY valid JSON matching this schema:
{{
  "project_overview": "Clear 2-sentence summary of what makes this project impactful",
  "system_architecture_summary": "Simple explanation of how the system parts talk to each other",
  "tech_stack_comparison": [
    {{
      "technology": "Tool name (e.g. FastAPI vs Flask or PostgreSQL vs MongoDB)",
      "alternatives": "Alternative choices",
      "why_better": "Why this is recommended for this project in simple words",
      "learning_curve": "Easy / Moderate / Steep",
      "verdict": "Clear recommendation"
    }}
  ],
  "roadmap_phases": [
    {{
      "phase_title": "Phase 1: Research, Requirements & SRS",
      "timeframe": "Weeks 1-4",
      "goal": "Clear milestone goal",
      "tasks": ["Task A", "Task B", "Task C"],
      "deliverables": "SRS document and wireframe mockups"
    }}
  ],
  "modules": [
    {{
      "module_name": "API & Ingestion Service",
      "simple_purpose": "Accepts user requests and validates payloads",
      "recommended_tech": "FastAPI + Pydantic",
      "key_responsibilities": ["Endpoint security", "Rate limiting", "Data schema validation"]
    }}
  ],
  "viva_defense_tips": [
    "Practical advice for when professors ask tough questions during project viva"
  ]
}}"""
            response = genai_client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            raw = json.loads(response.text)
            return MentorResponse(
                response="Detailed mentorship blueprint generated by Gemini",
                blueprint=MentorBlueprint(**raw),
                source="gemini"
            )
        except Exception as err:
            print(f"Gemini API error in mentor: {err}")

    # Fallback blueprint
    return MentorResponse(
        response="Mentorship blueprint generated by OrbitMentor Engine",
        source="orbitmentor-engine",
        blueprint=MentorBlueprint(
            project_overview=f"A well-architected capstone in {req.domain} combining practical software engineering with real-world utility.",
            system_architecture_summary="A 3-tier system: modern reactive frontend, asynchronous REST backend API, and a persistent relational database with caching.",
            tech_stack_comparison=[
                StackComparisonItem(
                    technology="FastAPI (Python) vs Node.js (Express)",
                    alternatives="Django, Flask, Spring Boot",
                    why_better="FastAPI gives automated OpenAPI/Swagger documentation, native async/await for fast response times, and strict type checking with Pydantic.",
                    learning_curve="Moderate (Python developers pick it up in 2-3 days)",
                    verdict="Recommended for rapid development and clean API contracts"
                ),
                StackComparisonItem(
                    technology="PostgreSQL vs MongoDB",
                    alternatives="MySQL, SQLite",
                    why_better="PostgreSQL offers strict ACID compliance, structured relations, and optional JSON/vector extensions if ML features are added later.",
                    learning_curve="Moderate",
                    verdict="Best choice for reliable data integrity and final year project grading"
                ),
                StackComparisonItem(
                    technology="React (Vite) vs Flutter Web",
                    alternatives="Vue.js, Next.js",
                    why_better="React with Vite builds instantaneously, has the largest ecosystem of UI packages, and runs smoothly in all browsers.",
                    learning_curve="Moderate",
                    verdict="Ideal for high-grade responsive web dashboards"
                )
            ],
            roadmap_phases=[
                RoadmapPhase(
                    phase_title="Phase 1: Project Scope & Architecture",
                    timeframe="Weeks 1 - 4",
                    goal="Finalize SRS, system design diagrams, and setup GitHub repository.",
                    tasks=["Draft Software Requirements Specification (SRS)", "Draw High-Level Architecture (DFD / UML)", "Setup boilerplate repo with Docker & CI/CD"],
                    deliverables="Approved Project Proposal & Initial Wireframes"
                ),
                RoadmapPhase(
                    phase_title="Phase 2: Core Backend & Database",
                    timeframe="Weeks 5 - 8",
                    goal="Build core data models, API endpoints, and database migrations.",
                    tasks=["Design relational database schema", "Implement CRUD API endpoints", "Write unit test cases covering edge conditions"],
                    deliverables="Working backend verified on Swagger UI"
                ),
                RoadmapPhase(
                    phase_title="Phase 3: Frontend & System Integration",
                    timeframe="Weeks 9 - 12",
                    goal="Connect UI screens with backend endpoints and polish user flows.",
                    tasks=["Implement responsive pages and dark/light theme", "Connect REST API services with error handling", "Add search and autocomplete features"],
                    deliverables="End-to-end working prototype"
                ),
                RoadmapPhase(
                    phase_title="Phase 4: Testing, Deployment & Viva Prep",
                    timeframe="Weeks 13 - 16",
                    goal="Deploy project to cloud, benchmark response times, and prepare project report.",
                    tasks=["Run integration tests and load tests", "Deploy to cloud (Render / Vercel / Cloud Run)", "Write project report and prepare slides for viva"],
                    deliverables="Live production URL & Final Thesis Document"
                )
            ],
            modules=[
                ModuleComponent(
                    module_name="Client Web Application",
                    simple_purpose="Provides responsive UI for users to browse, search, and manage project items.",
                    recommended_tech="React + TypeScript + Tailwind CSS",
                    key_responsibilities=["Input validation", "State management", "Light/Dark theme toggle"]
                ),
                ModuleComponent(
                    module_name="Core Backend API Service",
                    simple_purpose="Processes business logic, orchestrates data pipelines, and enforces security.",
                    recommended_tech="FastAPI + Pydantic",
                    key_responsibilities=["Route handling", "Authentication-free direct access", "External AI pipeline hooks"]
                ),
                ModuleComponent(
                    module_name="Data Storage & Caching Layer",
                    simple_purpose="Stores system records, project states, and session logs with fast lookups.",
                    recommended_tech="PostgreSQL + Redis",
                    key_responsibilities=["Relational data integrity", "Query optimization", "Safe data persistence"]
                )
            ],
            viva_defense_tips=[
                "Always justify why you picked your tech stack based on trade-offs, not just 'because it was popular'.",
                "Be ready to explain how you handled API errors, latency, and database edge cases.",
                "Demonstrate live database records and show your API documentation in action."
            ]
        )
    )


@app.post("/api/chat", response_model=ChatResponse)
async def mentor_chat(req: ChatRequest):
    """Interactive mentor Q&A supporting real conversation history."""
    if genai_client:
        try:
            # Build conversation context
            conversation = f"Project Context:\nTitle: {req.project_title}\nDomain: {req.domain}\nSkills: {', '.join(req.skills)}\n\n"
            for msg in req.history[-6:]:  # Keep recent turns
                role = "Student" if msg.role == "user" else "Mentor"
                conversation += f"{role}: {msg.content}\n"
            conversation += f"Student: {req.message}\nMentor:"

            response = genai_client.models.generate_content(
                model="gemini-3.8-flash",
                contents=f"""You are PROJECT ORBITMENTOR, a friendly, encouraging senior software architect guiding an engineering student.
Answer the student's question clearly, concisely, and practically. Avoid heavy jargon. Provide code hints or bullet points if applicable.

{conversation}"""
            )
            return ChatResponse(reply=response.text or "I am here to guide your project development.", source="gemini")
        except Exception as err:
            print(f"Gemini API chat error: {err}")

    # Fallback chat response
    return ChatResponse(
        reply=f"That's a great question regarding '{req.project_title}'. In a typical engineering project, focusing on clear module separation and keeping your API endpoints small and well-tested will make your final viva presentation much smoother. For your next step, I recommend setting up your database schema first before wiring up the frontend.",
        source="orbitmentor-engine"
    )
