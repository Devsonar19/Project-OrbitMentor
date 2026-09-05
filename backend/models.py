from pydantic import BaseModel
from typing import List, Optional

class GenerateRequest(BaseModel):
    skills: List[str]
    domain: str
    tier: str

class ProjectIdea(BaseModel):
    id: str = "1"
    title: str
    description: str

class GenerateResponse(BaseModel):
    ideas: List[ProjectIdea]

class MentorRequest(BaseModel):
    idea_title: Optional[str] = None
    skills: Optional[List[str]] = None
    domain: Optional[str] = None
    idea_summary: Optional[str] = None
    message: Optional[str] = None
    chat_history: Optional[List[dict]] = None

class TechRationale(BaseModel):
    tech: str
    reason: str

class ModuleComponent(BaseModel):
    name: str
    purpose: str

class RoadmapPhase(BaseModel):
    phase: str
    tasks: List[str]

class MentorBlueprint(BaseModel):
    architecture: str
    rationale: List[TechRationale]
    roadmap: List[RoadmapPhase]
    components: List[ModuleComponent]

class MentorResponse(BaseModel):
    response: str
    blueprint: Optional[MentorBlueprint] = None
