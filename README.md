#  AI Negotiation Simulator

Fuelix is a high-performance simulation platform for mastering the art of negotiation. It uses an adaptive LLM engine to simulate complex scenarios across multiple difficulty levels.

## Features
- **Scenario Generation**: Dynamic business and personal negotiation contexts.
- **Adaptive Dialogue Engine**: AI personas that adjust their tactics based on the selected difficulty (Novice, Intermediate, Expert).
- **Feedback Scoring**: Multi-dimensional analysis of performance metrics like Empathy, Assertiveness, and Value Creation.

## Setup

### Backend (FastAPI)
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the server:
   ```bash
   python -m app.main
   ```
   The API will be available at `http://localhost:8000`.

### Frontend (React + Vite)
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Architecture
- **Backend**: FastAPI for high-performance API handling.
- **LLM Layer**: Dialogue management with system-prompted personas.
- **Frontend**: React with Framer Motion for a premium, interactive experience.
