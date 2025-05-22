from django.core.management.base import BaseCommand
from django.db import transaction
from brainstorm.models import Prompt
import logging

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class Command(BaseCommand):
    help = "Seed the database with creative prompts for ideas, titles, and quotes."

    IDEA_PROMPTS = [
        "What if humans could photosynthesize like plants?",
        "Design a city that's built entirely underground",
        "Imagine a world where sleep is no longer necessary",
        "What would society look like if teleportation was invented?",
        "Create a new sport that combines elements of chess and parkour",
        "Describe a technology that allows people to share memories",
        "What if animals could communicate with humans?",
        "Design a home for humans living on Mars",
        "Imagine a world where everyone has a mild superpower",
        "What if the internet was replaced by something completely different?",
        "Create a society where aging stops at 25",
        "Design a sustainable food system for the year 2100",
        "What if humans could switch bodies with each other temporarily?",
        "Imagine a world where music has physical properties",
        "Design a currency based on something other than money",
        "What if education was entirely self-directed?",
        "Create a new form of government not yet tried",
        "What if humans could perceive all wavelengths of light?",
        "Design a communication system without using language",
        "Imagine a society without the concept of ownership",
        "What would transportation look like without wheels?",
        "Create a new holiday celebrating something we take for granted",
        "What if humans had a reliable way to record their dreams?",
        "Design a social media platform focused on genuine connection",
        "Imagine a world where humans hibernate for part of the year",
        "What would fashion be like if comfort was the only consideration?",
        "Create a society where children make the rules",
        "What if we discovered a new sense beyond the traditional five?",
        "Design a form of entertainment that doesn't use screens",
        "Imagine a world where buildings grow organically",
        "What if dreams were a form of time travel?",
        "Design a society where art is the primary currency",
        "Imagine a world where weather responds to human emotions",
        "What if humans could 'pause' time for themselves?",
        "Create a transportation system based on animal movement patterns",
    ]

    TITLE_PROMPTS = [
        "The Last Echo of Silence",
        "Whispers in the Digital Wind",
        "Chronicles of the Forgotten Key",
        "Beyond the Quantum Horizon",
        "The Art of Invisible Things",
        "When Time Folds Twice",
        "Echoes from Tomorrow",
        "The Memory Collector's Dilemma",
        "Shadows of the Unwritten",
        "The Algorithm of Human Hearts",
        "Dancing with Theoretical Physics",
        "The Secret Language of Ordinary Objects",
        "Cartography of Dreams",
        "The Unexpected Symphony",
        "Parallel Lives of the Impossible",
        "The Architecture of Hope",
        "Conversations with My Future Self",
        "The Science of Lost Things",
        "Fragments of Imaginary History",
        "When Patterns Break",
        "The Geometry of Human Connection",
        "Blueprints for Invisible Machines",
        "The Paradox of Simple Decisions",
        "Echoes of Unspoken Words",
        "The Weight of Digital Shadows",
        "Chronicles of the Almost Forgotten",
        "The Philosophy of Final Questions",
        "Whispers from the Quantum Field",
        "The Archaeology of Tomorrow",
        "Notes on the Impossible Journey",
        "The Cartographer of Forgotten Places",
        "Symphonies of Silent Spaces",
        "When Algorithms Dream",
        "The Theory of Improbable Connections",
        "Memoirs of an Imaginary Friend",
    ]

    QUOTE_PROMPTS = [
        "The universe is made of stories, not atoms.",
        "Creativity is intelligence having fun.",
        "Every moment is a fresh beginning.",
        "What we know is a drop, what we don't know is an ocean.",
        "The only true wisdom is knowing you know nothing.",
        "The purpose of our lives is to be happy.",
        "Life is what happens when you're busy making other plans.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "It is never too late to be what you might have been.",
        "The best way to predict the future is to create it.",
        "Simplicity is the ultimate sophistication.",
        "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
        "The mind is everything. What you think you become.",
        "It does not matter how slowly you go as long as you do not stop.",
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        "The only impossible journey is the one you never begin.",
        "Happiness is not something ready-made. It comes from your own actions.",
        "The question isn't who is going to let me; it's who is going to stop me.",
        "It is during our darkest moments that we must focus to see the light.",
        "Don't count the days, make the days count.",
        "The journey of a thousand miles begins with one step.",
        "Life is 10% what happens to us and 90% how we react to it.",
        "I have not failed. I've just found 10,000 ways that won't work.",
        "Everything you can imagine is real.",
        "If you tell the truth, you don't have to remember anything.",
        "Strive not to be a success, but rather to be of value.",
        "Do what you can, with what you have, where you are.",
        "The secret of getting ahead is getting started.",
        "It's not what you look at that matters, it's what you see.",
        "You must be the change you wish to see in the world.",
        "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        "The way to get started is to quit talking and begin doing.",
        "Life is really simple, but we insist on making it complicated.",
        "When you reach the end of your rope, tie a knot in it and hang on.",
        "Always remember that you are absolutely unique. Just like everyone else.",
    ]

    def handle(self, *args, **options):
        if Prompt.objects.exists():
            logger.info("Prompts already exist in the database. Seeding skipped.")
            return

        prompts_to_create = []

        for prompt in self.IDEA_PROMPTS:
            prompts_to_create.append(Prompt(type='idea', text=prompt))
        for prompt in self.TITLE_PROMPTS:
            prompts_to_create.append(Prompt(type='title', text=prompt))
        for prompt in self.QUOTE_PROMPTS:
            prompts_to_create.append(Prompt(type='quote', text=prompt))

        with transaction.atomic():
            Prompt.objects.bulk_create(prompts_to_create)

        total = len(prompts_to_create)
        logger.info(f"Successfully seeded {total} prompts:")
        logger.info(f"  - Ideas: {len(self.IDEA_PROMPTS)}")
        logger.info(f"  - Titles: {len(self.TITLE_PROMPTS)}")
        logger.info(f"  - Quotes: {len(self.QUOTE_PROMPTS)}")
