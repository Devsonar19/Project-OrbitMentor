# PROJECT ORBITMENTOR - Backend Service

FastAPI-powered backend service providing AI project idea generation and mentorship blueprints for engineering students.

## Features
- **Project Idea Generation (`/api/generate`)**: Tailors ideas across 3 complexity tiers:
  - **Safe**: Fast, easy to build, high feasibility.
  - **Applied ML**: Integrates ML workflows, RAG, and vector search.
  - **Super**: Enterprise complexity, distributed systems, suitable for research publications.
- **Project Mentor Blueprint (`/api/mentor`)**: Provides tech stack comparisons, 16-week final-year roadmaps, and modular architecture breakdowns.
- **Interactive Chat (`/api/chat`)**: Multi-turn mentor Q&A with real chat history.
- **Search Autocomplete APIs (`/api/domains`, `/api/skills`)**: Extensive domain and skill options.

## Quick Start

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment:
```bash
cp .env.example .env
# Add your GEMINI_API_KEY in .env
```

3. Run development server:
```bash
uvicorn main:app --reload --port 8000
```

Interactive API documentation will be available at `http://localhost:8000/docs`.
