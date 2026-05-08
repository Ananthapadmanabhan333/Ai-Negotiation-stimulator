from typing import List
from ..models.schemas import Scenario, Message, FeedbackReport, FeedbackScore

class ScoringModel:
    def __init__(self):
        pass

    def analyze_negotiation(self, scenario: Scenario, history: List[Message]) -> FeedbackReport:
        # In a real application, this would be another LLM call to 'analyze' the transcript.
        # The prompt would ask the LLM to rate the user on specific metrics.
        
        # Mocking the scoring logic for demonstration:
        transcript = "\n".join([f"{m.role}: {m.content}" for m in history])
        
        # Placeholder metrics
        metrics = [
            FeedbackScore(metric="Empathy", score=85, explanation="You acknowledged the other party's constraints early on, which built rapport."),
            FeedbackScore(metric="Value Creation", score=70, explanation="You proposed a creative solution for the bonus structure, but could have explored equity more."),
            FeedbackScore(metric="Assertiveness", score=60, explanation="You were a bit quick to accept the first counter-offer. Consider holding your ground longer."),
            FeedbackScore(metric="Strategic Framing", score=75, explanation="You framed your request around market data effectively.")
        ]
        
        overall = sum(m.score for m in metrics) // len(metrics)
        
        return FeedbackReport(
            overall_score=overall,
            metrics=metrics,
            strengths=["Rapport building", "Data-backed arguments"],
            weaknesses=["Premature concession", "Narrow focus on base salary"],
            advice="Next time, try using the 'Higher Authority' tactic: mention you need to check with a spouse or mentor to buy time and create pressure."
        )
