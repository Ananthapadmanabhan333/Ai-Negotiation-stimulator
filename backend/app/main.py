from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models.schemas import Scenario, Message, NegotiationSession, FeedbackReport
from .core.scenario import get_all_scenarios, get_scenario_by_title
from .core.dialogue import DialogueEngine
from .core.scoring import ScoringModel
import uuid

app = FastAPI(title="AI Negotiation Simulator API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session storage (use Redis/Database in production)
sessions = {}

engine = DialogueEngine()
scorer = ScoringModel()

@app.get("/scenarios")
async def list_scenarios():
    return get_all_scenarios()

@app.post("/session/start")
async def start_session(scenario_title: str):
    scenario = get_scenario_by_title(scenario_title)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    session_id = str(uuid.uuid4())
    session = NegotiationSession(session_id=session_id, scenario=scenario)
    sessions[session_id] = session
    return session

@app.post("/session/{session_id}/message")
async def send_message(session_id: str, message: Message):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    if session.is_completed:
        raise HTTPException(status_code=400, detail="Session already completed")
    
    # Add user message
    session.messages.append(message)
    
    # Get AI response
    ai_response_content = await engine.get_response(session.scenario, session.messages)
    ai_message = Message(role="assistant", content=ai_response_content)
    session.messages.append(ai_message)
    
    return ai_message

@app.post("/session/{session_id}/complete")
async def complete_session(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    session.is_completed = True
    
    # Analyze and score
    report = scorer.analyze_negotiation(session.scenario, session.messages)
    return report

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
