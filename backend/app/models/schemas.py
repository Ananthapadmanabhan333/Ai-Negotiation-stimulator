from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Scenario(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str  # "Novice", "Intermediate", "Expert"
    user_role: str
    ai_role: str
    user_objective: str
    ai_objective: str
    context: str
    parameters: Dict[str, Any] = Field(default_factory=dict) # e.g., budget range, deadlines

class Message(BaseModel):
    role: str # "user", "assistant", "system"
    content: str

class NegotiationSession(BaseModel):
    session_id: str
    scenario: Scenario
    messages: List[Message] = []
    is_completed: bool = False

class FeedbackScore(BaseModel):
    metric: str
    score: int # 1-100
    explanation: str

class FeedbackReport(BaseModel):
    overall_score: int
    metrics: List[FeedbackScore]
    strengths: List[str]
    weaknesses: List[str]
    advice: str
