# System Architecture: Project OrbitMentor

## 1. Technology Stack
- **Frontend:** Flutter (Targeting Web & Android to preserve 10MB repository limit).
- **Backend:** FastAPI (Python) for asynchronous, high-speed API processing and strict Pydantic validation.
- **AI Engine:** Google Gemini API (`google-generativeai`) using structured JSON generation.
- **Database & Auth:** Firebase Firestore (for saving project histories) and Firebase Authentication.

## 2. Directory Layout (Monorepo)
AI_Project_Idea_Generator/
├── .gitignore
├── frontend/ (Flutter - devoid of ios, macos, windows, linux directories)
└── backend/ (Python FastAPI)
    ├── main.py
    ├── models.py
    └── .env (Excluded from git tracking)

## 3. Data Flow Architecture
1. User inputs skills and domain preferences in the Flutter frontend.
2. A secure HTTP POST request is sent to the FastAPI backend endpoints (`/api/generate` or `/api/mentor`).
3. FastAPI structures the prompt parameters and invokes the Gemini API with enforced JSON response schemas.
4. FastAPI validates the response via Pydantic and returns structured data to Flutter.
5. Flutter parses the response, displays the high-contrast UI, and syncs history to Firebase Firestore.