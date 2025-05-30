import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faRocket,
  faStar,
  faSearch,
  faArrowLeft,
  faMagic,
  faCompass,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/404.css';

export default function NotFound() {
  const [isHoveringPlanet, setIsHoveringPlanet] = useState(false);

  const generateStars = () => {
    return Array.from({ length: 50 }, (_, i) => (
      <div
        key={i}
        className="floating-star"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`,
        }}
      >
        <FontAwesomeIcon icon={faStar} />
      </div>
    ));
  };

  return (
    <div className="not-found-container">
      {/* Cosmic Background */}
      <div className="cosmic-bg">
        <div className="stars-layer">{generateStars()}</div>
        
        {/* Moving cosmic elements */}
        <div className="cosmic-element cosmic-1"></div>
        <div className="cosmic-element cosmic-2"></div>
        <div className="cosmic-element cosmic-3"></div>
      </div>

      {/* Main Content */}
      <div className="not-found-content">
        {/* Floating 404 */}
        <div className="floating-404">
          <h1 className="error-code">
            <span className="digit">4</span>
            <span 
              className={`digit planet-zero ${isHoveringPlanet ? 'hovered' : ''}`}
              onMouseEnter={() => setIsHoveringPlanet(true)}
              onMouseLeave={() => setIsHoveringPlanet(false)}
            >
              0
            </span>
            <span className="digit">4</span>
          </h1>
          
          {/* Orbiting elements around the "0" */}
          <div className="orbit-container">
            <div className="orbit orbit-1">
              <div className="orbit-element">
                <FontAwesomeIcon icon={faRocket} />
              </div>
            </div>
            <div className="orbit orbit-2">
              <div className="orbit-element">
                <FontAwesomeIcon icon={faMagic} />
              </div>
            </div>
            <div className="orbit orbit-3">
              <div className="orbit-element">
                <FontAwesomeIcon icon={faCompass} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="error-content">
          <h2 className="error-title gradient-text">
            Lost in the Digital Cosmos?
          </h2>
          
          <p className="error-description">
            Looks like you've drifted into uncharted space! This page seems to have 
            vanished into a black hole, but don't worry—we'll help you navigate back 
            to familiar territory.
          </p>

          {/* Interactive Buttons */}
          <div className="action-buttons">
            <Link to="/" className="cosmic-btn primary-btn">
              <FontAwesomeIcon icon={faHome} />
              <span>Return Home</span>
              <div className="btn-glow"></div>
            </Link>
            
            <Link to="/about" className="cosmic-btn secondary-btn">
              <FontAwesomeIcon icon={faSearch} />
              <span>Explore</span>
              <div className="btn-glow"></div>
            </Link>
            
            <button 
              onClick={() => window.history.back()} 
              className="cosmic-btn tertiary-btn"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Go Back</span>
              <div className="btn-glow"></div>
            </button>
          </div>

          {/* Fun Interactive Elements */}
          <div className="space-facts">
            <div className="fact-bubble">
              <FontAwesomeIcon icon={faStar} className="fact-icon" />
              <span>Did you know? Error 404 was named after room 404 at CERN!</span>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="particles-container">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="floating-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
} 