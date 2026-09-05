from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from models import GenerateRequest, GenerateResponse, MentorRequest, MentorResponse, ProjectIdea, MentorBlueprint, TechRationale, RoadmapPhase, ModuleComponent

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {"status": "ok"}

@app.post("/api/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    try:
        if api_key:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""Generate 3 distinct capstone project ideas for the domain '{req.domain}' using skills {req.skills} and complexity tier '{req.tier}'.
            Return ONLY a valid JSON object with an array 'ideas' where each item has 'id', 'title', and 'description'."""
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            data = json.loads(response.text)
            return data
    except Exception as e:
        print(f"Gemini generation error: {e}")

    # Fallback response
    return GenerateResponse(
        ideas=[
            ProjectIdea(id="1", title=f"{req.domain} AI Copilot ({req.tier})", description=f"Advanced system using {', '.join(req.skills)} for real-time inference and workflows."),
            ProjectIdea(id="2", title=f"Decentralized {req.domain} Mesh", description=f"Secure fault-tolerant architecture built with {req.skills[0] if req.skills else 'Python'} and edge nodes."),
            ProjectIdea(id="3", title=f"Autonomous {req.domain} Intelligence Engine", description="High-throughput processing engine designed for enterprise deployment."),
        ]
    )

@app.post("/api/mentor", response_model=MentorResponse)
async def mentor(req: MentorRequest):
    # Determine if it's a chat request or a blueprint request based on the message
    is_chat = bool(req.message)
    try:
        if api_key:
            model = genai.GenerativeModel('gemini-1.5-flash')
            if is_chat:
                chat = model.start_chat(history=[])
                if req.chat_history:
                     for msg in req.chat_history:
                         role = 'user' if msg.get('role') == 'user' else 'model'
                         content = msg.get('content', '')
                         # we can skip loading the whole history into the object if needed,
                         # but for simplicity let's just send the context with the message
                prompt = f"Previous context: {req.chat_history}\n\nUser Question: {req.message}"
                response = model.generate_content(prompt)
                return MentorResponse(response=response.text)
            else:
                prompt = f"""Provide a deep technical mentorship blueprint for the project '{req.idea_title}' in domain '{req.domain}' using stack {req.skills}.
                Return ONLY valid JSON matching the mentor blueprint schema."""
                response = model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                data = json.loads(response.text)
                return MentorResponse(response="Generated blueprint via Gemini", blueprint=MentorBlueprint(**data))
    except Exception as e:
        print(f"Gemini mentor error: {e}")

    # Fallback blueprint
    if is_chat:
        return MentorResponse(response=f"Fallback mock mentor response to your query: '{req.message}'. Please check your GEMINI_API_KEY if you want real AI responses.")
    else:
        return MentorResponse(
            response="Generated fallback mentorship blueprint",
            blueprint=MentorBlueprint(
                architecture="Microservices event-driven architecture with secure API gateway.",
                rationale=[TechRationale(tech="FastAPI", reason="High performance asynchronous execution")],
                roadmap=[RoadmapPhase(phase="Phase 1: Research & Setup", tasks=["Requirements analysis", "Repo setup"])],
                components=[ModuleComponent(name="API Gateway", purpose="Request routing and authentication")]
            )
        )
