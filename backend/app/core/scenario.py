import uuid
from typing import List
from ..models.schemas import Scenario

SCENARIO_TEMPLATES = [
    {
        "title": "The Salary Stall",
        "description": "You've been offered a new role at a tech startup. The base salary is lower than your expectation, but the equity package is decent.",
        "difficulty": "Novice",
        "user_role": "Candidate",
        "ai_role": "Hiring Manager",
        "user_objective": "Increase base salary by 15% without losing the offer.",
        "ai_objective": "Keep the base salary as low as possible while ensuring the candidate joins.",
        "context": "The company has a fixed budget for this role but has some flexibility in 'signing bonuses' or 'performance bonuses'.",
    },
    {
        "title": "Vendor Lock-in",
        "description": "A critical software vendor is increasing their annual license fee by 40%. You need to renew, but this hike is over budget.",
        "difficulty": "Intermediate",
        "user_role": "Procurement Manager",
        "ai_role": "Enterprise Sales Lead",
        "user_objective": "Bring the price hike down to under 10% or secure significant service add-ons.",
        "ai_objective": "Maximize revenue and lock the client into a 3-year contract.",
        "context": "The sales lead is under pressure to hit quarterly targets and is more likely to give discounts for longer commitments.",
    },
    {
        "title": "The Merger Deadlock",
        "description": "Two companies are merging. You represent the smaller firm. There's a dispute over which CEO will lead the combined entity.",
        "difficulty": "Expert",
        "user_role": "Board Representative",
        "ai_role": "Majority Shareholder Rep",
        "user_objective": "Ensure your CEO gets the top spot or a highly influential COO role with veto powers.",
        "ai_objective": "Ensure their CEO leads the company to maintain 'investor confidence'.",
        "context": "The merger is public knowledge and a failure to agree would cause stock prices for both to plummet. Time is of the essence.",
    }
]

def get_all_scenarios() -> List[Scenario]:
    return [Scenario(id=str(uuid.uuid4()), **template) for template in SCENARIO_TEMPLATES]

def get_scenario_by_title(title: str) -> Scenario:
    for template in SCENARIO_TEMPLATES:
        if template["title"] == title:
            return Scenario(id=str(uuid.uuid4()), **template)
    return None
