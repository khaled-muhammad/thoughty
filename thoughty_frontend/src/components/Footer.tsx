import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faXTwitter,
  faLinkedin,
  faInstagram,
  faGithub,
  faDiscord
} from '@fortawesome/free-brands-svg-icons';
import { 
  faHeart,
  faArrowRight,
  faEnvelope,
  faBolt,
  faUsers,
  faBook,
  faHeadset,
  faShield,
  faGavel,
  faCookie
} from '@fortawesome/free-solid-svg-icons';
import logoImage from '../assets/logo.png';

export default function Footer() {
    return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #6366f1 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`
        }}></div>
      </div>
      
      {/* Floating Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center p-2 border border-white/20">
                <img 
                  src={logoImage} 
                  alt="Thoughty Logo" 
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                thoughty
              </h3>
            </div>
            
            <p className="text-gray-300 mb-6 text-lg leading-relaxed max-w-md">
              The gamified thought development platform for entrepreneurs and creators. 
              Transform your ideas into powerful innovations.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-8">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-indigo-400" />
                Stay Updated
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  Subscribe
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-sm" />
                </button>
              </div>
            </div>
            
            {/* Social Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faUsers} className="mr-2 text-indigo-400" />
                Follow Us
              </h4>
            <div className="flex space-x-4">
                {[
                  { icon: faXTwitter, href: "#", label: "X", color: "hover:text-white" },
                  { icon: faLinkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-600" },
                  { icon: faInstagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
                  { icon: faGithub, href: "#", label: "GitHub", color: "hover:text-gray-300" },
                  { icon: faDiscord, href: "#", label: "Discord", color: "hover:text-indigo-400" }
                ].map((social, index) => (
                  <a 
                    key={index}
                    href={social.href} 
                    aria-label={social.label}
                    className={`w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600`}
                  >
                    <FontAwesomeIcon icon={social.icon} className="text-lg" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Product Section */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white flex items-center">
              <FontAwesomeIcon icon={faBolt} className="mr-2 text-indigo-400" />
              Product
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Features", href: "#" },
                { name: "Pricing", href: "#" },
                { name: "Roadmap", href: "#" },
                { name: "Beta Program", href: "#" },
                { name: "API", href: "#" }
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FontAwesomeIcon icon={faArrowRight} className="text-xs text-indigo-400" />
                    </span>
                    {item.name}
                  </a>
              </li>
              ))}
            </ul>
          </div>
          
          {/* Resources Section */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-white flex items-center">
              <FontAwesomeIcon icon={faBook} className="mr-2 text-purple-400" />
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "/about", icon: faUsers },
                { name: "Blog", href: "#", icon: faBook },
                { name: "Guides", href: "#", icon: faBook },
                { name: "Community", href: "#", icon: faUsers },
                { name: "Help Center", href: "#", icon: faHeadset }
              ].map((item, index) => (
                <li key={index}>
                  {item.href.startsWith('/') ? (
                    <Link 
                      to={item.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs text-purple-400" />
                      </span>
                      {item.name}
                    </Link>
                  ) : (
                    <a 
                      href={item.href} 
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs text-purple-400" />
                      </span>
                      {item.name}
                    </a>
                  )}
              </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 mt-16 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            
            {/* Copyright */}
            <div className="flex items-center space-x-2 mb-4 lg:mb-0">
              <p className="text-gray-400">
                &copy; 2025 
                <span className="font-semibold text-white mx-1">THOUGHTY</span>
                ALL RIGHTS RESERVED
              </p>
              <span className="text-gray-600">•</span>
              <p className="text-gray-400 flex items-center">
                Made with 
                <FontAwesomeIcon icon={faHeart} className="text-red-500 mx-1 animate-pulse" />
                for creators
              </p>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              {[
                { name: "Privacy Policy", href: "/privacy-policy", icon: faShield },
                { name: "Terms of Service", href: "/terms-of-service", icon: faGavel },
                { name: "Cookie Policy", href: "/cookie-policy", icon: faCookie }
              ].map((item, index) => (
                <Link 
                  key={index}
                  to={item.href} 
                  className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center space-x-1 group"
                >
                  <FontAwesomeIcon 
                    icon={item.icon} 
                    className="text-xs text-gray-500 group-hover:text-indigo-400 transition-colors" 
                  />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
    </footer>
    );
}