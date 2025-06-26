from django.core.management.base import BaseCommand
from gamification.models import Badge

class Command(BaseCommand):
    help = 'Set up default badges for the gamification system'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Deleting existing badges...'))
        
        # Delete all existing badges
        Badge.objects.all().delete()

        self.stdout.write(self.style.SUCCESS('Setting up new project-relevant badges...'))

        # New badges data matching the project purpose
        badges_data = [
            {
                'name': 'First Pod',
                'description': 'Created your first thought pod',
                'requirements': 'Create 1 thought pod',
                'icon_svg': 'M12 6v6m0 0v6m0-6h6m-6 0H6',
                'badge_type': 'starter',
                'condition_code': 'user_pods >= 1'
            },
            {
                'name': 'Idea Seller',
                'description': 'Sold your first idea',
                'requirements': 'Successfully sell 1 idea',
                'icon_svg': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                'badge_type': 'achievement',
                'condition_code': 'ideas_sold >= 1'
            },
            {
                'name': 'Voter',
                'description': 'Cast your first vote on an idea',
                'requirements': 'Vote on 1 idea',
                'icon_svg': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                'badge_type': 'starter',
                'condition_code': 'votes_cast >= 1'
            },
            {
                'name': 'Democratic Voice',
                'description': 'Participated in the voting process',
                'requirements': 'Cast 10 votes on different ideas',
                'icon_svg': 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z',
                'badge_type': 'consistent',
                'condition_code': 'votes_cast >= 10'
            },
            {
                'name': 'Idea Evolver',
                'description': 'Upgraded an idea to the next level',
                'requirements': 'Evolve 1 idea from seed to sprout',
                'icon_svg': 'M7 11l5-6-5-6v4H5a2 2 0 100 4h2v4zm1 4h2a2 2 0 100-4H8v4zm6-1l5 6 5-6v-4h-2a2 2 0 100-4h2V6z',
                'badge_type': 'explorer',
                'condition_code': 'ideas_evolved >= 1'
            },
            {
                'name': 'Growth Master',
                'description': 'Mastered the idea evolution process',
                'requirements': 'Evolve 5 ideas through all stages',
                'icon_svg': 'M13 10V3L4 14h7v7l9-11h-7z',
                'badge_type': 'master',
                'condition_code': 'fully_evolved_ideas >= 5'
            },
            {
                'name': 'Mind Mentee',
                'description': 'Used the Mind Mentor for guidance',
                'requirements': 'Use Mind Mentor 1 time',
                'icon_svg': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
                'badge_type': 'explorer',
                'condition_code': 'mentor_sessions >= 1'
            },
            {
                'name': 'Wisdom Seeker',
                'description': 'Regular Mind Mentor user',
                'requirements': 'Use Mind Mentor 20 times',
                'icon_svg': 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
                'badge_type': 'dedication',
                'condition_code': 'mentor_sessions >= 20'
            },
            {
                'name': 'Brainstormer',
                'description': 'Started your first brainstorm session',
                'requirements': 'Complete 1 brainstorm session',
                'icon_svg': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
                'badge_type': 'starter',
                'condition_code': 'brainstorm_sessions >= 1'
            },
            {
                'name': 'Creative Dynamo',
                'description': 'Active brainstorming participant',
                'requirements': 'Complete 10 brainstorm sessions',
                'icon_svg': 'M13 10V3L4 14h7v7l9-11h-7z',
                'badge_type': 'consistent',
                'condition_code': 'brainstorm_sessions >= 10'
            },
            {
                'name': 'Idea Cloner',
                'description': 'Created a variation of an existing idea',
                'requirements': 'Clone and modify 1 idea',
                'icon_svg': 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z',
                'badge_type': 'explorer',
                'condition_code': 'ideas_cloned >= 1'
            },
            {
                'name': 'Variation Master',
                'description': 'Expert at creating idea variations',
                'requirements': 'Clone and modify 20 ideas',
                'icon_svg': 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2',
                'badge_type': 'master',
                'condition_code': 'ideas_cloned >= 20'
            },
            {
                'name': 'Battle Warrior',
                'description': 'Won your first mind battle',
                'requirements': 'Win 1 mind battle',
                'icon_svg': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                'badge_type': 'achievement',
                'condition_code': 'battles_won >= 1'
            },
            {
                'name': 'Champion',
                'description': 'Dominated the battle arena',
                'requirements': 'Win 10 mind battles',
                'icon_svg': 'M12 15l3.5-3.5L12 8 8.5 11.5 12 15z M5 12l7-7 7 7-7 7-7-7z',
                'badge_type': 'master',
                'condition_code': 'battles_won >= 10'
            },
            {
                'name': 'Community Builder',
                'description': 'Made meaningful connections',
                'requirements': 'Get 50 upvotes on your ideas',
                'icon_svg': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
                'badge_type': 'community',
                'condition_code': 'total_upvotes >= 50'
            },
            {
                'name': 'Thought Leader',
                'description': 'Recognized as an influential thinker',
                'requirements': 'Get 200 upvotes on your ideas',
                'icon_svg': 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
                'badge_type': 'legendary',
                'condition_code': 'total_upvotes >= 200'
            },
            {
                'name': 'Entrepreneur',
                'description': 'Successfully monetized multiple ideas',
                'requirements': 'Sell 10 ideas',
                'icon_svg': 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
                'badge_type': 'legendary',
                'condition_code': 'ideas_sold >= 10'
            },
            {
                'name': 'Idea Machine',
                'description': 'Prolific idea creator',
                'requirements': 'Create 50 thought pods',
                'icon_svg': 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                'badge_type': 'achievement',
                'condition_code': 'user_pods >= 50'
            },
            {
                'name': 'Roulette Explorer',
                'description': 'Embraced randomness in creativity',
                'requirements': 'Use brainstorm roulette 5 times',
                'icon_svg': 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
                'badge_type': 'explorer',
                'condition_code': 'roulette_uses >= 5'
            },
            {
                'name': 'Platform Legend',
                'description': 'Master of all platform features',
                'requirements': 'Unlock all other badges',
                'icon_svg': 'M12 15l8-8m0 0h-8m8 0v8m-8-8l-8-8m8 8H4m8 8v8',
                'badge_type': 'legendary',
                'condition_code': 'all_other_badges_unlocked'
            },
        ]

        created_count = 0

        for badge_data in badges_data:
            badge = Badge.objects.create(**badge_data)
            created_count += 1
            self.stdout.write(f'Created badge: {badge.name}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Badge setup complete! Created: {created_count} new badges'
            )
        ) 