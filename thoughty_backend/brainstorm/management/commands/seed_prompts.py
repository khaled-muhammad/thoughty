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
    help = "Seed the database with developer-focused prompts for project ideas, app titles, and coding quotes."

    IDEA_PROMPTS = [
        "Build a collaborative code editor with real-time video chat and AI assistance",
        "Create a developer productivity app that tracks coding habits and suggests improvements",
        "Design a platform for sharing and discovering open-source project templates",
        "Build a tool that automatically generates API documentation from code comments",
        "Create a mobile app for practicing coding challenges with gamification",
        "Design a system for automatically testing and deploying microservices",
        "Build a platform for developers to showcase projects with interactive demos",
        "Create a tool that converts design mockups to responsive web components",
        "Design a collaborative debugging platform for remote teams",
        "Build an AI-powered code review assistant that learns from your codebase",
        "Create a developer-focused social network with built-in code sharing",
        "Design a tool for visualizing and optimizing database performance",
        "Build a platform for hosting and managing development environments in the cloud",
        "Create a mobile app for learning new programming languages through mini-games",
        "Design a tool that automatically generates unit tests from function signatures",
        "Build a platform for organizing and sharing coding bootcamp resources",
        "Create a tool for monitoring and alerting on application performance metrics",
        "Design a system for automatically backing up and versioning project configurations",
        "Build a collaborative whiteboard app specifically designed for system architecture",
        "Create a tool that helps developers estimate project timelines more accurately",
        "Design a platform for finding and connecting with coding mentors",
        "Build a tool that automatically refactors legacy code using AI",
        "Create a mobile app for practicing system design interviews",
        "Design a platform for sharing and discovering developer productivity tips",
        "Build a tool that generates semantic commit messages from code changes",
        "Create a system for automatically creating development environment setup scripts",
        "Design a platform for collaborative technical writing and documentation",
        "Build a tool that helps developers optimize their development workflow",
        "Create a mobile app for tracking and celebrating coding achievements",
        "Design a platform for hosting virtual hackathons and coding competitions",
        "Build a tool that automatically generates API clients from OpenAPI specs",
        "Create a system for managing and deploying configuration across environments",
        "Design a platform for peer code reviews with built-in learning resources",
        "Build a tool that visualizes code complexity and technical debt",
        "Create a mobile app for developers to practice algorithms during commutes",
    ]

    TITLE_PROMPTS = [
        "CodeCraft: The Developer's Playground",
        "DevFlow: Streamlining Development Workflows",
        "GitConnect: Social Coding Platform",
        "AlgoTrainer: Interactive Algorithm Learning",
        "CloudBuild: Serverless Development Environment",
        "APIForge: Automated Documentation Generator",
        "DebugBuddy: Collaborative Debugging Tool",
        "TestWiz: AI-Powered Unit Test Generator",
        "CodeMentor: Developer Mentorship Network",
        "DeployEase: One-Click Deployment Platform",
        "MetricsHub: Application Performance Monitor",
        "RefactorBot: AI Code Optimization Tool",
        "DevQuest: Gamified Coding Challenges",
        "ArchViz: System Architecture Visualizer",
        "CodeReview Pro: Enhanced Peer Review Platform",
        "SkillTree: Developer Progress Tracker",
        "HackathonHub: Virtual Competition Platform",
        "ConfigManager: Environment Configuration Tool",
        "CodeSnippet Vault: Reusable Code Library",
        "DevTime: Project Timeline Estimator",
        "TechDoc: Collaborative Documentation Platform",
        "CodeAnalyzer: Technical Debt Visualizer",
        "DevChat: Team Communication for Developers",
        "MockupToCode: Design-to-Code Converter",
        "GitStats: Repository Analytics Dashboard",
        "CodeLinter Pro: Advanced Code Quality Tool",
        "DevPortfolio: Interactive Project Showcase",
        "APIStudio: API Design and Testing Tool",
        "DatabaseOptimizer: Query Performance Analyzer",
        "CodeCollab: Real-time Collaborative Editor",
        "DevBootcamp: Online Coding Education Platform",
        "TechTrends: Developer News Aggregator",
        "CodeSecure: Automated Security Scanner",
        "DevWorkspace: Cloud Development Environment",
        "ProjectManager Dev: Developer-Focused Project Management",
    ]

    QUOTE_PROMPTS = [
        "Code is poetry written for machines but read by humans.",
        "The best error message is the one that never shows up.",
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "First, solve the problem. Then, write the code.",
        "The only way to go fast is to go well.",
        "Clean code always looks like it was written by someone who cares.",
        "Programming isn't about what you know; it's about what you can figure out.",
        "Code never lies, comments sometimes do.",
        "The computer was born to solve problems that did not exist before.",
        "Talk is cheap. Show me the code.",
        "There are only two hard things in Computer Science: cache invalidation and naming things.",
        "The best way to learn to code is to write lots of code.",
        "Debugging is twice as hard as writing the code in the first place.",
        "Every developer you know got there by solving problems they were unqualified to solve until they actually did it.",
        "The function of good software is to make the complex appear to be simple.",
        "Simplicity is the ultimate sophistication.",
        "Make it work, make it right, make it fast.",
        "Code is like humor. When you have to explain it, it's bad.",
        "The most important property of a program is whether it accomplishes the intention of its user.",
        "Programming is not a science. Programming is a craft.",
        "Good code is its own best documentation.",
        "Deleted code is debugged code.",
        "The best programmers are not marginally better than merely good ones. They are an order-of-magnitude better.",
        "Walking on water and developing software from a specification are easy if both are frozen.",
        "It's not a bug – it's an undocumented feature.",
        "The most disastrous thing that you can ever learn is your first programming language.",
        "In theory, there is no difference between theory and practice. But, in practice, there is.",
        "Premature optimization is the root of all evil.",
        "Programs must be written for people to read, and only incidentally for machines to execute.",
        "Software is eating the world.",
        "The best code is no code at all.",
        "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.",
        "Programming is thinking, not typing.",
        "The only constant in the technology industry is change.",
        "Don't comment bad code – rewrite it.",
    ]

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force reseed by deleting existing prompts first',
        )

    def handle(self, *args, **options):
        force_reseed = options.get('force', False)
        
        if Prompt.objects.exists():
            if force_reseed:
                logger.info("Force reseed enabled. Deleting existing prompts...")
                Prompt.objects.all().delete()
                logger.info("Existing prompts deleted.")
            else:
                logger.info("Prompts already exist in the database. Use --force to reseed.")
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
        logger.info(f"Successfully seeded {total} developer-focused prompts:")
        logger.info(f"  - Project Ideas: {len(self.IDEA_PROMPTS)}")
        logger.info(f"  - App Titles: {len(self.TITLE_PROMPTS)}")
        logger.info(f"  - Coding Quotes: {len(self.QUOTE_PROMPTS)}")
