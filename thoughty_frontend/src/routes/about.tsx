import '../styles/about.css';
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLinkedin,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';
import {
  faEnvelope,
  faPaperPlane,
  faUser,
  faPhone,
  faChevronDown,
  faCommentDots,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div id="about" className="page pt-[5rem]">
      {/* hero section */}
      <section id="hero" className="grid-pattern">
        <div className="left-part">
          <img src={logo} alt="logo" />
          <div className="magical-ring"></div>
        </div>
        <div className="right-part">
          <h1 className="gradient-text">YOUR SPACE TO THINK FREELY & PLAYFULLY</h1>
          <h4>We help thinkers like you explore and express ideas with creativity, and depth...</h4>
          <p>Our mission is to transform thinking into an interactive journey — blending creativity, structured tools,
            and gamified challenges — so you can evolve your thoughts, battle perspectives, and grow alongside a
            community of curious minds.</p>
          <Link
            to="/" className="btn-hover inline-flex items-center justify-center px-6 py-3 my-3 border border-transparent text-base font-medium rounded-md text-white pink-gradient-bg shadow-lg hover:opacity-90">Explore
          </Link>
        </div>
      </section>
      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-[var(--darker)] to-[var(--dark)]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Who We <span className="gradient-text">Are</span></h2>
              <p className="text-lg opacity-90 mb-6"> Thoughty is a creative digital platform designed to help thinkers like
                you grow, evolve, and explore bold ideas. From Thought Pods to Mind Battles and AI-powered tools, we've
                built a space where ideas are more than posts — they're living conversations.</p>
              <p className="text-lg opacity-90 mb-8">We're just a two-person team — one frontend, one backend — who built
                MindVerse from scratch with nothing but curiosity, creativity, and a shared vision. No big studio. No
                investors. Just heart, code, and a passion for meaningful expression.</p>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--input-br)] stats-card transition-all duration-300">
                  <h3 className="text-3xl font-bold text-[var(--primary-light)] mb-2">150+</h3>
                  <p className="opacity-80">Projects Completed</p>
                </div>
                <div
                  className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--input-br)] stats-card transition-all duration-300">
                  <h3 className="text-3xl font-bold text-[var(--secondary)] mb-2">40+</h3>
                  <p className="opacity-80">Team Members</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="bg-[var(--primary)] absolute -top-6 -left-6 w-full h-full rounded-2xl -z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Our Team" className="rounded-2xl shadow-2xl w-full h-auto" />
            </div>
          </div>
        </div>
      </section>
      {/* Team Section */}
      <section className="py-20 bg-[var(--dark)]">
        <div className="container mx-auto px-6 flex flex-col items-center ">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet The <span className="gradient-text">Team</span></h2>
            <p className="max-w-2xl mx-auto text-lg opacity-90">The brilliant minds behind our success story.</p>
          </div>

          <div className="flex  justify-center gap-[50px]">
            <div
              className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--input-br)] team-card transition-all duration-300 w-[350px]">
              <div
                className="w-full h-64 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] rounded-lg mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80"
                  className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold">Malak Sabry</h3>
              <p className="text-[var(--secondary)] mb-3">CTO</p>
              <p className="text-sm opacity-90 mb-4">Tech wizard specializing in AI, blockchain, and scalable architectures.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-[var(--light)] hover:text-[var(--secondary)]">
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a href="#" className="text-[var(--light)] hover:text-[var(--secondary)]">
                  <FontAwesomeIcon icon={faGithub} />
                </a>
                <a href="#" className="text-[var(--light)] hover:text-[var(--secondary)]">
                  <FontAwesomeIcon icon={faEnvelope} />
                </a>
              </div>
            </div>

            <div
              className="bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--input-br)] team-card transition-all duration-300 w-[350px]">
              <div
                className="w-full h-64 bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] rounded-lg mb-4 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80"
                  className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold">Khaled Muhammad</h3>
              <p className="text-[var(--secondary)] mb-3">CTO</p>
              <p className="text-sm opacity-90 mb-4">Tech wizard specializing in AI, blockchain, and scalable architectures.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-[var(--light)] hover:text-[var(--secondary)]">
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
                <a href="#" className="text-[var(--light)] hover:text-[var(--secondary)]">
                  <FontAwesomeIcon icon={faGithub} />
                </a>
                <a href="#" className="text-[var(--light)] hover:text-[var(--secondary)]">
                  <FontAwesomeIcon icon={faEnvelope} />
                </a>
              </div>
            </div>


          </div>


        </div>
      </section>
      {/* contactUs section */}
      <section className="flex flex-col justify-center items-center mb-20">
        <div className="max-w-2xl w-full relative z-10">
          <div
            className="backdrop-blur-sm bg-[var(--card-bg)] rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-[1.005]">
            <div className="relative">
              {/* Animated header */}
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-center mb-8">
                  <div className="relative group">
                    <div
                      className="w-16 h-16 rounded-full bg-[var(--primary)] opacity-20 absolute -inset-2 blur-md group-hover:opacity-30 transition-all duration-300">
                    </div>
                    <div
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white glow hover:rotate-12 transition-transform duration-300 cursor-pointer tooltip">
                      <FontAwesomeIcon icon={faPaperPlane} className="text-2xl" />
                    </div>
                  </div>
                </div>

                <h1
                  className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-[var(--primary-light)] to-[var(--accent)] bg-clip-text text-transparent">
                  Contact Us
                </h1>
                <p className="text-center text-gray-300 mb-8">
                  Have questions? <span
                    className="inline-block hover:scale-110 transition-transform duration-200 cursor-default"
                    id="randomEmoji">😊</span> Fill out the form below
                </p>

                <form id="contactForm" className="space-y-6">
                  <div className="relative group">
                    <input type="text" id="name"
                      className="input-field w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-br)] rounded-lg text-white placeholder-transparent focus:input-focus transition-all duration-300 group-hover:border-[var(--primary-light)]"
                      placeholder="John Doe" required />
                    <label htmlFor="name"
                      className="floating-label absolute left-4 top-3 text-gray-400 pointer-events-none group-hover:text-[var(--primary-light)] transition-colors duration-300">
                      Full Name <span className="text-[var(--accent)]">*</span>
                    </label>
                    <div
                      className="absolute right-3 top-3.5 text-gray-400 group-hover:text-[var(--primary-light)] transition-colors duration-300">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  </div>

                  <div className="relative group">
                    <input type="email" id="email"
                      className="input-field w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-br)] rounded-lg text-white placeholder-transparent focus:input-focus transition-all duration-300 group-hover:border-[var(--primary-light)]"
                      placeholder="john@example.com" required />
                    <label htmlFor="email"
                      className="floating-label absolute left-4 top-3 text-gray-400 pointer-events-none group-hover:text-[var(--primary-light)] transition-colors duration-300">
                      Email Address <span className="text-[var(--accent)]">*</span>
                    </label>
                    <div
                      className="absolute right-3 top-3.5 text-gray-400 group-hover:text-[var(--primary-light)] transition-colors duration-300">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                  </div>

                  <div className="relative group">
                    <input type="tel" id="phone"
                      className="input-field w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-br)] rounded-lg text-white placeholder-transparent focus:input-focus transition-all duration-300 group-hover:border-[var(--primary-light)]"
                      placeholder="+1 (555) 123-4567" />
                    <label htmlFor="phone"
                      className="floating-label absolute left-4 top-3 text-gray-400 pointer-events-none group-hover:text-[var(--primary-light)] transition-colors duration-300">
                      Phone Number (optional)
                    </label>
                    <div
                      className="absolute right-3 top-3.5 text-gray-400 group-hover:text-[var(--primary-light)] transition-colors duration-300">
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                  </div>

                  <div className="relative group">
                    <select id="subject"
                      className="input-field w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-br)] rounded-lg text-white appearance-none focus:input-focus transition-all duration-300 group-hover:border-[var(--primary-light)] cursor-pointer">
                      <option value="" disabled selected></option>
                      <option value="support">Support</option>
                      <option value="sales">Sales</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                    <label htmlFor="subject"
                      className="floating-label absolute left-4 top-3 text-gray-400 pointer-events-none group-hover:text-[var(--primary-light)] transition-colors duration-300">
                      Subject <span className="text-[var(--accent)]">*</span>
                    </label>
                    <div
                      className="absolute right-3 top-3.5 text-gray-400 group-hover:text-[var(--primary-light)] transition-colors duration-300">
                      <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                  </div>

                  <div className="relative group">
                    <textarea id="message" rows={4}
                      className="input-field w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-br)] rounded-lg text-white placeholder-transparent focus:input-focus transition-all duration-300 group-hover:border-[var(--primary-light)]"
                      placeholder="Your message here..." required></textarea>
                    <label htmlFor="message"
                      className="floating-label absolute left-4 top-3 text-gray-400 pointer-events-none group-hover:text-[var(--primary-light)] transition-colors duration-300">
                      Your Message <span className="text-[var(--accent)]">*</span>
                    </label>
                    <div
                      className="absolute right-3 top-3.5 text-gray-400 group-hover:text-[var(--primary-light)] transition-colors duration-300">
                      <FontAwesomeIcon icon={faCommentDots} />
                    </div>
                  </div>

                  <div className="flex items-center group">
                    <input type="checkbox" id="consent"
                      className="w-4 h-4 rounded bg-[var(--input-bg)] border-[var(--input-br)] focus:ring-[var(--primary)] focus:ring-offset-[var(--dark)] group-hover:border-[var(--primary-light)] transition-colors duration-300 cursor-pointer"
                      required />
                    <label htmlFor="consent"
                      className="ml-2 text-sm text-gray-300 group-hover:text-[var(--primary-light)] transition-colors duration-300 cursor-pointer">
                      I agree to the <a href="#" className="text-[var(--primary-light)] hover:underline">privacy policy</a>
                    </label>
                  </div>

                  <div className="relative">
                    <button type="submit"
                      className="btn-primary w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2 ripple relative overflow-hidden transition-all duration-300"
                      id="submitBtn">
                      <span id="submitText">Send Message</span>
                      <FontAwesomeIcon icon={faPaperPlane} className="animate-pulse-slow" id="submitIcon" />
                      <div className="progress-bar"></div>
                    </button>
                    <div id="submitStatus"
                      className="hidden absolute -bottom-6 left-0 right-0 text-center text-sm text-[var(--secondary)]">
                    </div>
                  </div>
                </form>
              </div>

              <div
                className="px-8 py-4 bg-[var(--dark)] text-center text-gray-400 text-sm flex items-center justify-center space-x-2">
                <FontAwesomeIcon icon={faClock} />
                <p>We typically respond within 24 hours</p>
              </div>
            </div>
          </div>

          <div id="successMessage"
            className="hidden mt-6 backdrop-blur-sm bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--secondary)] bounce-in">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-full bg-[var(--secondary)] bg-opacity-20 flex items-center justify-center">
                  <i className="fas fa-check text-[var(--secondary)]"></i>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-[var(--light)]">Message sent successfully!</h3>
                <p className="mt-1 text-sm text-gray-300">Thank you for contacting us. We'll get back to you soon.</p>
                <button id="resetForm"
                  className="mt-3 text-sm text-[var(--primary-light)] hover:underline flex items-center group">
                  <span>Send another message</span>
                  <i className="fas fa-redo ml-1 group-hover:rotate-180 transition-transform duration-300"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}