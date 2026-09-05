# PROJECT ORBITMENTOR

**AI-Powered Capstone Project Generator & Technical Architecture Mentor** for undergraduate engineering students.

PROJECT ORBITMENTOR helps final-year engineering students discover realistic capstone ideas based on their skills and domain, while generating complete academic blueprints, 16-week roadmaps, technology trade-offs, and viva defense preparation guides.

---

## Features

- **Project Idea Generator**: Discover tailored project ideas across 3 distinct complexity tiers:
  - **Safe (96% Feasible)**: Production-ready web/mobile workflows with high completion certainty.
  - **Applied ML (88% Feasible)**: RAG, vector search, computer vision, and applied machine learning.
  - **Super (75% Feasible)**: High-concurrency distributed systems, microservices, and research-grade systems.
- **Academic 16-Week Roadmap**: 4 phased milestones mapped to university evaluation guidelines (SRS/DFD, Schema/CRUD, Integration, and Viva Defense).
- **Tech Stack Trade-off Comparison**: Justifications for architecture choices (e.g., FastAPI vs Express, PostgreSQL vs MongoDB) to defend during external viva examinations.
- **Viva Defense Preparation**: Top examiner questions, evaluation tips, and architectural defense strategies.
- **Interactive Mentor Chat**: Real-time technical guidance for database schemas, dataset curation, and team division.
- **Dual-Layer Fallback Engine**: Uninterrupted offline generation if API quota limits are reached.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend / API**: Node.js, Express, Vercel Serverless Functions (`/api/*`)
- **AI Engine**: Google Gemini 3.8 Flash via `@google/genai`
- **Build & Dev**: Vite 6, tsx, esbuild

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd project-orbitmentor
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

*(Note: The app includes a deterministic fallback engine and will run smoothly even without an API key).*

### 3. Run Locally

```bash
# Start development server on port 3000
npm run dev

# Run automated test suite
npm test

# Build for production
npm run build

# Start production server
npm start
```

---

## Deploying to Vercel

1. Push your code to GitHub / GitLab.
2. Import the repository in **Vercel**.
3. Go to **Settings** → **Environment Variables** and add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `your_gemini_api_key`
4. Click **Deploy**. Vercel will automatically build the static assets and mount the serverless API routes (`/api/*`) defined in `vercel.json`.
