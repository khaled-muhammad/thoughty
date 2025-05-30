import '../styles/home.css';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faSeedling,
  faChess,
  faDice,
  faRobot,
  faTrophy,
  faChartLine,
  faBrain,
  faChevronUp,
  faStar,
  faStarHalfAlt,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

// Custom hook within this file (simple) to animate fade-in elements on scroll
function useScrollFadeIn() {
  useEffect(() => {
    const elements = document.querySelectorAll('#landing .fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  useScrollFadeIn();
  return (
      <div id="landing" className="page">
    {/* Hero Section */}
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 flex items-center min-h-screen grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <div
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800/50 text-purple-400 mb-6 border border-gray-700">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2 pulse-dot"></div>
              COMING SOON
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Evolve Your <span className="gradient-text">Thinking</span> with
              Thoughty
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              A gamified platform that helps entrepreneurs and creators
              capture, develop, and share their ideas through AI-powered
              collaboration.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#cta"
                className="btn-hover inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white pink-gradient-bg shadow-lg hover:opacity-90">
                JOIN WAITLIST
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </a>
              <a href="#features"
                className="btn-hover inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700">
                EXPLORE FEATURES
              </a>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-800"
                  src="https://randomuser.me/api/portraits/women/12.jpg" alt="" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-800"
                  src="https://randomuser.me/api/portraits/men/32.jpg" alt="" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-800"
                  src="https://randomuser.me/api/portraits/women/44.jpg" alt="" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-800"
                  src="https://randomuser.me/api/portraits/men/65.jpg" alt="" />
              </div>
              <span className="ml-4 text-sm text-gray-400">Trusted by 10,000+ thinkers</span>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="floating">
              <div className="card p-1 overflow-hidden">
                <div className="bg-gray-900 rounded-xl p-6">
                  <div className="flex items-center mb-6">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">
                        Thought Evolution
                      </h3>
                      <p className="text-sm text-gray-400">
                        Current Pod: Business Growth
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-green-500 mr-2">Stage 3/5</span>
                      <FontAwesomeIcon icon={faChevronUp} className="text-green-500 text-xs" />
                    </div>
                  </div>
                  <div
                    className="h-64 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center">
                      <FontAwesomeIcon icon={faBrain} className="text-4xl text-purple-500 mb-2" />
                      <p className="text-gray-400 text-sm">
                        Your idea is evolving with AI insights
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Thought Pods</p>
                      <p className="font-medium text-white">12</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Mind Battles</p>
                      <p className="font-medium text-white">7</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">XP Points</p>
                      <p className="font-medium text-white">1,248</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section id="features" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Designed to help entrepreneurs develop and refine their best ideas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card p-8 fade-in">
            <div className="feature-icon">
              <FontAwesomeIcon icon={faSeedling} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Thought Pods</h3>
            <p className="text-gray-400">
              Capture and nurture your ideas through structured evolution
              stages, with AI-powered insights at each step.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card p-8 fade-in" style={{transitionDelay: "0.1s"}}>
            <div className="feature-icon">
              <FontAwesomeIcon icon={faChess} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Mind Battles</h3>
            <p className="text-gray-400">
              Challenge ideas in creative duels where the community votes and
              AI provides constructive verdicts.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card p-8 fade-in"style={{transitionDelay: "0.2s"}}>
            <div className="feature-icon">
              <FontAwesomeIcon icon={faDice} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">
              Brainstorm Roulette
            </h3>
            <p className="text-gray-400">
              AI-generated prompts and idea remixing to break through creative
              blocks and discover new perspectives.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card p-8 fade-in" style={{transitionDelay: "0.3s"}}>
            <div className="feature-icon">
              <FontAwesomeIcon icon={faRobot} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Mind Mentor AI</h3>
            <p className="text-gray-400">
              Your personal AI assistant that analyzes thought patterns and
              recommends resources for growth.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="card p-8 fade-in" style={{transitionDelay: "0.4s"}}>
            <div className="feature-icon">
              <FontAwesomeIcon icon={faTrophy} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Gamification</h3>
            <p className="text-gray-400">
              Earn tokens, unlock badges, and climb leaderboards as you
              develop and share your best ideas.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="card p-8 fade-in" style={{transitionDelay: "0.5s"}}>
            <div className="feature-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">
              Evolution Timeline
            </h3>
            <p className="text-gray-400">
              Track your intellectual growth and revisit how your ideas have
              transformed over time.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* How It Works Section */}
    <section id="how-it-works" className="py-20 bg-gray-900 grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="gradient-text">Thoughty</span> Works
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From initial spark to refined insight - here's the journey of a
            Thought Pod
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {/* Stage 1 */}
            <div className="evolution-stage card p-8 fade-in">
              <div className="evolution-dot"></div>
              <h3 className="text-xl font-bold mb-3 text-white">1. Seed</h3>
              <p className="text-gray-400 mb-4">
                Capture your raw idea or question. This could be anything from
                a business concept to a personal reflection.
              </p>
              <div className="thought-pod p-4 rounded-lg">
                <p className="text-sm text-gray-300 italic">
                  "What if we created a subscription service for rare book
                  collectors?"
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="evolution-stage card p-8 fade-in" style={{transitionDelay: "0.2s"}}>
              <div className="evolution-dot"></div>
              <h3 className="text-xl font-bold mb-3 text-white">2. Expand</h3>
              <p className="text-gray-400 mb-4">
                AI suggests related concepts and prompts to help you develop
                the idea further. Community members can contribute.
              </p>
              <div className="thought-pod p-4 rounded-lg">
                <p className="text-sm text-gray-300">
                  "Consider: Curated monthly selections based on collector
                  preferences, authentication service, digital companion app
                  with book histories."
                </p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="evolution-stage card p-8 fade-in" style={{transitionDelay: "0.4s"}}>
              <div className="evolution-dot"></div>
              <h3 className="text-xl font-bold mb-3 text-white">3. Challenge</h3>
              <p className="text-gray-400 mb-4">
                Enter Mind Battle mode to test your idea against alternatives
                or have AI play devil's advocate.
              </p>
              <div className="mind-battle p-4 rounded-lg">
                <p className="text-sm text-gray-300">
                  "Battle: Subscription model vs. marketplace model for rare
                  books. AI analysis shows subscription has higher lifetime
                  value but slower initial growth."
                </p>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="evolution-stage card p-8 fade-in" style={{transitionDelay: "0.6s"}}>
              <div className="evolution-dot"></div>
              <h3 className="text-xl font-bold mb-3 text-white">4. Refine</h3>
              <p className="text-gray-400 mb-4">
                Synthesize feedback and AI insights into a polished concept
                with actionable next steps.
              </p>
              <div className="thought-pod p-4 rounded-lg">
                <p className="text-sm text-gray-300">
                  "Hybrid model: Subscription for curated selections +
                  marketplace for collector-to-collector sales. First MVP:
                  Partner with 3 rare book dealers for pilot program."
                </p>
              </div>
            </div>

            {/* Stage 5 */}
            <div className="evolution-stage card p-8 fade-in" style={{transitionDelay: "0.8s"}}>
              <div className="evolution-dot"></div>
              <h3 className="text-xl font-bold mb-3 text-white">5. Manifest</h3>
              <p className="text-gray-400 mb-4">
                Connect your refined idea to real-world execution with
                resource recommendations and potential collaborators.
              </p>
              <div className="thought-pod p-4 rounded-lg">
                <p className="text-sm text-gray-300">
                  "Execution plan: 1) Create landing page to gauge interest 2)
                  Approach rare book fairs for partnerships 3) Develop
                  authentication verification process."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section id="testimonials" className="py-20 bg-gray-900 border-t border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <span className="gradient-text">Innovators</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Entrepreneurs and creators who transformed their thinking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="card p-8 fade-in">
            <div className="card-content">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <img className="w-12 h-12 rounded-full object-cover mr-4"
                    src="https://randomuser.me/api/portraits/women/32.jpg" alt="Sarah Johnson" />
                  <div>
                    <h4 className="font-bold text-white">Sarah Johnson</h4>
                    <p className="text-gray-500 text-sm">Founder, NovelNest</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-6">
                  "Thoughty helped me evolve my book subscription idea from a
                  vague concept to a fully-fledged business plan. The Mind Battles
                  were particularly valuable for stress-testing assumptions."
                </p>
              </div>
              <div className="card-footer">
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-4">
                    {Array(5).fill(null).map((_, idx) => (
                      <FontAwesomeIcon key={idx} icon={faStar} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">245 XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="card p-8 fade-in" style={{transitionDelay: "0.2s"}}>
            <div className="card-content">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <img className="w-12 h-12 rounded-full object-cover mr-4" src="https://randomuser.me/api/portraits/men/54.jpg"
                    alt="Michael Chen" />
                  <div>
                    <h4 className="font-bold text-white">Michael Chen</h4>
                    <p className="text-gray-500 text-sm">CEO, TechVista</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-6">
                  "As a serial entrepreneur, I've never found a better tool for
                  developing ideas. The AI mentor suggested books and frameworks
                  I'd never encountered that completely changed my approach."
                </p>
              </div>
              <div className="card-footer">
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-4">
                    {Array(5).fill(null).map((_, idx) => (
                      <FontAwesomeIcon key={idx} icon={faStar} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">1,024 XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="card p-8 fade-in" style={{transitionDelay: "0.4s"}}>
            <div className="card-content">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <img className="w-12 h-12 rounded-full object-cover mr-4"
                    src="https://randomuser.me/api/portraits/women/68.jpg" alt="Priya Patel" />
                  <div>
                    <h4 className="font-bold text-white">Priya Patel</h4>
                    <p className="text-gray-500 text-sm">Creative Director, Lumina</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-6">
                  "When our team hits creative blocks, we turn to Brainstorm
                  Roulette. It's led to some of our most innovative campaign
                  ideas. The gamification keeps everyone engaged."
                </p>
              </div>
              <div className="card-footer">
                <div className="flex items-center">
                  <div className="flex text-yellow-400 mr-4">
                    {Array(4).map((_, idx) => (
                      <FontAwesomeIcon key={idx} icon={faStar} />
                    ))}
                    <FontAwesomeIcon icon={faStarHalfAlt} />
                  </div>
                  <span className="text-sm text-gray-500">782 XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Pricing Section */}
    <section id="pricing" className="py-20 bg-gray-900 grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your creative needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Explorer Plan */}
          <div className="card p-8 text-center fade-in">
            <div className="card-content">
              <div className="card-body">
                <h3 className="text-xl font-bold mb-2 text-white">Explorer</h3>
                <p className="text-gray-400 mb-6">For casual thinkers</p>
                <div className="text-4xl font-bold text-white mb-6">Free</div>
                <ul className="space-y-3 mb-8">
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" /> 3
                    Active Thought Pods
                  </li>
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" /> Basic
                    AI Insights
                  </li>
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" /> 1 Mind
                    Battle per week
                  </li>
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                    Community Feedback
                  </li>
                </ul>
              </div>
              <div className="card-footer">
                <a href="#cta"
                  className="btn-hover inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-gray-100">
                  GET STARTED
                </a>
              </div>
            </div>
          </div>

          {/* Creator Plan */}
          <div className="card p-8 text-center relative fade-in" style={{transitionDelay: "0.2s"}}>
            <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <div className="card-content">
              <div className="card-body">
                <h3 className="text-xl font-bold mb-2 text-white">Creator</h3>
                <p className="text-gray-400 mb-6">For serious entrepreneurs</p>
                <div className="text-4xl font-bold text-white mb-6">
                  $19<span className="text-lg text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                    Unlimited Thought Pods
                  </li>
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                    Advanced AI Insights
                  </li>
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                    Unlimited Mind Battles
                  </li>
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" /> Mind
                    Mentor AI
                  </li>
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                    Brainstorm Roulette
                  </li>
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                    Priority Feedback
                  </li>
                </ul>
              </div>
              <div className="card-footer">
                <a href="#cta"
                  className="btn-hover inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white pink-gradient-bg hover:opacity-90">
                  START FREE TRIAL
                </a>
              </div>
            </div>
          </div>

          {/* Team Plan */}
          <div className="card p-8 text-center fade-in" style={{transitionDelay: "0.4s"}}>
            <div className="card-content">
              <div className="card-body">
                <h3 className="text-xl font-bold mb-2 text-white">Team</h3>
                <p className="text-gray-400 mb-6">For collaborative groups</p>
                <div className="text-4xl font-bold text-white mb-6">
                  $99<span className="text-lg text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" /> All
                    Creator Features
                  </li>
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" /> Up to
                    5 Team Members
                  </li>
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" /> Shared
                    Thought Pods
                  </li>
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" /> Team
                    Analytics
                  </li>
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                    Private Workspaces
                  </li>
                  <li className="text-gray-400">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                    Dedicated Support
                  </li>
                </ul>
              </div>
              <div className="card-footer">
                <a href="#cta"
                  className="btn-hover inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-gray-100">
                  CONTACT SALES
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section id="cta" className="py-20 bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Evolve Your <span className="gradient-text">Thinking?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join our beta program and help shape the future of Thoughty.
          </p>
          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input type="email" placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button type="submit"
                className="btn-hover inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white pink-gradient-bg shadow-lg hover:opacity-90">
                JOIN WAITLIST
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </button>
            </div>
          </form>
          <p className="text-sm text-gray-500 mt-4">
            By joining, you agree to our early access terms.
          </p>
        </div>
      </div>
    </section>
  </div>
  );
}