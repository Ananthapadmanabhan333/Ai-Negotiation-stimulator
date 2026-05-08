import os
from typing import List
from ..models.schemas import Scenario, Message

# In a real app, you'd use an LLM SDK here.
# For this simulation, we'll construct the system prompts.

class DialogueEngine:
    def __init__(self, model_name: str = "gemini-1.5-flash"):
        self.model_name = model_name

    def construct_system_prompt(self, scenario: Scenario) -> str:
        difficulty_mods = {
            "Novice": "Be reasonable and open to compromise. Clearly state your needs if asked.",
            "Intermediate": "Be firm on your position. Use standard negotiation tactics like 'limited authority' or 'the nibble'. Do not give in too easily.",
            "Expert": "Be aggressive and highly strategic. Use advanced tactics like 'anchoring', 'emotional appeal', or 'the bogey'. Hide your true walk-away point and try to extract maximum value. Be skeptical of the user's claims."
        }

        prompt = f"""
        You are acting as the {scenario.ai_role} in a negotiation simulation.
        Scenario: {scenario.title}
        Context: {scenario.context}
        Your Objective: {scenario.ai_objective}
        User's Role: {scenario.user_role}
        User's Objective: {scenario.user_objective}
        
        Difficulty Level: {scenario.difficulty}
        Behavioral Instruction: {difficulty_mods.get(scenario.difficulty, "")}
        
        Guidelines:
        1. Stay in character at all times.
        2. Do not break character or mention you are an AI.
        3. Respond concisely (1-3 sentences) to keep the dialogue fluid.
        4. If the user makes a good point or a fair offer, respond appropriately according to your difficulty level.
        5. If the negotiation reaches a conclusion or a stalemate, indicate it clearly.
        """
        return prompt

    async def get_response(self, scenario: Scenario, history: List[Message]) -> str:
        system_prompt = self.construct_system_prompt(scenario)
        
        # Simple simulation logic for demo purposes
        if not history:
            return f"Hello, I'm {scenario.ai_role}. Let's discuss this."
            
        last_user_msg = history[-1].content.lower()
        
        if scenario.title == "The Salary Stall":
            if "salary" in last_user_msg or "pay" in last_user_msg:
                return "I understand your concerns about the base salary. However, our budget for this role is quite tight. What kind of increase were you looking for?"
            if "15%" in last_user_msg or "percent" in last_user_msg:
                return "15% is a significant jump. If we were to consider that, we might need to adjust the equity component. How do you feel about that trade-off?"
            if "flexible" in last_user_msg or "bonus" in last_user_msg:
                return "I'm glad you're open to other forms of compensation. We could potentially look at a signing bonus. What would make this offer work for you?"
        
        return f"[AI Persona: {scenario.ai_role}] I've noted your point. Let's look at the broader context of {scenario.title} and find a path forward."

# Simulation logic for the 'get_response' in a real deployment:
# messages = [{"role": "system", "content": system_prompt}] + history
# response = client.chat.completions.create(model=self.model_name, messages=messages)
# return response.choices[0].message.content
