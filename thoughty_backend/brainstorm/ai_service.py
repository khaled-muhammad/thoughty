import json
import os
import logging
from django.conf import settings
from groq import Groq

logger = logging.getLogger(__name__)

class AIVariationGenerator:
    """Service to generate variations using AI models"""

    def __init__(self):
        # Get API key from settings
        self.api_key = getattr(settings, 'GROQ_API_KEY', os.environ.get('GROQ_API_KEY'))
        if not self.api_key:
            logger.warning("GROQ API key not configured!")
        self.client = Groq(api_key=self.api_key,)
    
    def generate_variations(self, prompt_text, prompt_type, count=3):
        """
        Generate variations based on a prompt
        
        Args:
            prompt_text: The original prompt text
            prompt_type: Type of prompt (idea, title, quote)
            count: Number of variations to generate
            
        Returns:
            List of generated variations or empty list on error
        """

        if not self.api_key:
            logger.error("Cannot generate variations: No API key")
            return []
        
        try:
            system_message = self._get_system_prompt(prompt_type)
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages= [
                    {"role": "system", "content": system_message + 'Respond only with JSON using this format: \{"variations":["variation 1 content goes here as text", "variation 2 content goes here as text", "etc ..."]\}'},
                    {"role": "user", "content": f"Original prompt: {prompt_text}\n\nGenerate {count} creative variations."},
                ],
                max_tokens=500,
                temperature=0.8,
                n=1,
                response_format={"type":"json_object"}
            )
            # Parse the results - expecting a numbered list
            variations = json.loads(response.choices[0].message.content)['variations']
            
            return variations[:count] # Ensure we don't exceed requested count

        except Exception as e:
            logger.error(f"Error generating variations: {str(e)}")
            return []
    
    def _get_system_prompt(self, prompt_type):
        """Get the appropriate system prompt based on prompt type"""

        base_prompt = "You are helping youth develop critical thinking skills. "

        if prompt_type == 'idea':
            return base_prompt + "Generate variations that encourage analytical thinking and different perspectives on the concept."
        elif prompt_type == 'question':
            return base_prompt + "Create deep questions that make people examine assumptions and think from first principles."
        elif prompt_type == 'problem':
            return base_prompt + "Reframe the problem statement to reveal different aspects and potential solution approaches."
        elif prompt_type == 'title':
            return "You are a title generation expert. Create alternative titles that capture the essence of the original but with different wording and style."
        elif prompt_type == 'quote':
            return "You are a quote variation generator. Create alternative quotes that express similar wisdom or insights as the original quote but with different wording."
        else:
            return "Generate creative variations of the given prompt. Each variation should be unique but related to the original prompt."