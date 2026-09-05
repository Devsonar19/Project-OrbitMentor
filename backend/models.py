from pydantic import BaseModel, Field
from typing import List, Optional

# --- Generator Models ---

class GenerateRequest(BaseModel):
    skills: List[str] = Field(..., description="List of technical skills or tools")
    domain: str = Field(..., description="Target industry or domain")
    tier: str = Field("Safe", description="Complexity tier: 'Safe', 'Applied ML', or 'Super'")

class ProjectIdea(BaseModel):
    id: str
    title: str
    tier: str
    problem: str
    solution: str
    recommended_stack: List[str]
    key_features: List[str]
    feasibility_score: str
    why_good_for_final_year: str

class GenerateResponse(BaseModel):
    ideas: List[ProjectIdea]
    source: str = "gemini"

# --- Mentor Blueprint Models ---

class MentorRequest(BaseModel):
    idea_title: str
    domain: str
    skills: List[str]
    tier: Optional[str] = "Safe"
    idea_summary: Optional[str] = None

class StackComparisonItem(BaseModel):
    technology: str
    alternatives: str
    why_better: str
    learning_curve: str
    verdict: str

class RoadmapPhase(BaseModel):
    phase_title: str
    timeframe: str
    goal: str
    tasks: List[str]
    deliverables: str

class ModuleComponent(BaseModel):
    module_name: str
    simple_purpose: str
    recommended_tech: str
    key_responsibilities: List[str]

class MentorBlueprint(BaseModel):
    project_overview: str
    system_architecture_summary: str
    tech_stack_comparison: List[StackComparisonItem]
    roadmap_phases: List[RoadmapPhase]
    modules: List[ModuleComponent]
    viva_defense_tips: List[str]

class MentorResponse(BaseModel):
    response: str
    blueprint: MentorBlueprint
    source: str = "gemini"

# --- Mentor Chat Models ---

class ChatMessage(BaseModel):
    role: str # "user" or "model" / "assistant"
    content: str

class ChatRequest(BaseModel):
    project_title: str
    domain: str
    skills: List[str]
    history: List[ChatMessage]
    message: str

class ChatResponse(BaseModel):
    reply: str
    source: str = "gemini"
