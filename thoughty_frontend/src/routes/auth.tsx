import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import "../styles/auth.css";
import { authService } from '../services/auth';

interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form data states
  const [loginData, setLoginData] = useState<LoginFormData>({
    username: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState<RegisterFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Check URL params on mount
  useEffect(() => {
    const request = searchParams.get('request');
    if (request === 'signup') {
      setIsSignUp(true);
    } else if (request === 'signin') {
      setIsSignUp(false);
    }
  }, [searchParams]);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$/;

    return passwordRegex.test(password);
  };


  const validateUsername = (username: string): boolean => {
    // 3-20 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  // Form validation
  const validateLoginForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!loginData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(loginData.username)) {
      newErrors.username = 'Username must be 3-20 characters, alphanumeric and underscores only';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!registerData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!registerData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(registerData.username)) {
      newErrors.username = 'Username must be 3-20 characters, alphanumeric and underscores only';
    }

    if (!registerData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(registerData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!registerData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsLoading(true);
    
    try {
      // Use actual API service
      const response = await authService.login({
        username: loginData.username,
        password: loginData.password
      });

      if (response.success && response.data) {
        // Store auth data
        authService.setToken(response.data.token);
        if (response.data.refreshToken) {
          authService.setRefreshToken(response.data.refreshToken);
        }
        authService.setUser(response.data.user);

        toast.success(response.message || 'Login successful! Welcome back!');
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        // Handle API errors
        if (response.errors) {
          // Convert API errors (string arrays) to form errors (strings)
          const formErrors: FormErrors = {};
          Object.entries(response.errors).forEach(([key, messages]) => {
            formErrors[key] = Array.isArray(messages) ? messages[0] : messages;
          });
          setErrors(formErrors);
        }
        toast.error(response.message || 'Login failed. Please check your credentials.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsLoading(true);
    
    try {
      // Use actual API service
      const response = await authService.register({
        email: registerData.email,
        username: registerData.username,
        password: registerData.password
      });

      if (response.success) {
        toast.success(response.message || 'Account created successfully! Please check your email to verify your account.');
        
        // Switch to login form and clear register form
        setTimeout(() => {
          setIsSignUp(false);
          setRegisterData({
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false
          });
          setErrors({});
        }, 1000);
      } else {
        // Handle API errors
        if (response.errors) {
          // Convert API errors (string arrays) to form errors (strings)
          const formErrors: FormErrors = {};
          Object.entries(response.errors).forEach(([key, messages]) => {
            formErrors[key] = Array.isArray(messages) ? messages[0] : messages;
          });
          setErrors(formErrors);
        }
        toast.error(response.message || 'Registration failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between forms
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    // Update URL
    const newParams = new URLSearchParams(searchParams);
    newParams.set('request', !isSignUp ? 'signup' : 'signin');
    navigate(`/auth?${newParams.toString()}`, { replace: true });
  };

  // Social login handlers
  const handleGoogleLogin = () => {
    toast.info('Google login will be implemented soon!');
  };

  const handleFacebookLogin = () => {
    toast.info('Facebook login will be implemented soon!');
  };

  return (
    <div className="auth-reimagined" id="signup">
      <div className="auth-container">
        {/* Background Elements */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
        
        {/* Main Content */}
        <div className="auth-content">
          {/* Enhanced Toggle Switch */}
          <div 
            className={`modern-toggle ${isSignUp ? 'active' : ''}`} 
            onClick={toggleForm}
          >
            <div className="toggle-track">
              <div className="toggle-labels">
                <span className="label-text">Log In</span>
                <span className="label-text">Sign Up</span>
              </div>
              <div className="toggle-thumb"></div>
            </div>
          </div>

          {/* Card Container */}
          <div className="form-container">
            <div className={`form-flipper ${isSignUp ? 'flipped' : ''}`}>
              
              {/* Login Form */}
              <div className="form-side front-side">
                <div className="form-header">
                  <h1>Welcome Back</h1>
                  <p>Sign in to continue your journey</p>
                </div>
                
                <form onSubmit={handleLoginSubmit} className="modern-form">
                  <div className="input-field">
                    <label htmlFor="username">Username</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        className={`form-input ${errors.username ? 'error' : ''}`}
                        value={loginData.username}
                        onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.username && <span className="field-error">{errors.username}</span>}
                  </div>

                  <div className="input-field">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter your password"
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.password && <span className="field-error">{errors.password}</span>}
                  </div>

                  <div className="form-footer">
                    <a href="#" className="forgot-link">
                      Forgot password?
                    </a>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="primary-button"
                    disabled={isLoading}
                  >
                    <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
                    {!isLoading && <div className="button-shine"></div>}
                  </button>
                </form>
              </div>

              {/* Register Form */}
              <div className="form-side back-side">
                <div className="form-header">
                  <h1>Join Us Today</h1>
                  <p>Create your account and start exploring</p>
                </div>
                
                <form onSubmit={handleRegisterSubmit} className="modern-form">
                  <div className="input-field">
                    <label htmlFor="email2">Email Address</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        id="email2"
                        placeholder="Enter your email"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>

                  <div className="input-field">
                    <label htmlFor="username2">Username</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="username2"
                        placeholder="Choose a username"
                        className={`form-input ${errors.username ? 'error' : ''}`}
                        value={registerData.username}
                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                        disabled={isLoading}
                      />
                    </div>
                    {errors.username && <span className="field-error">{errors.username}</span>}
                  </div>

                  <div className="input-field">
                    <label htmlFor="password2">Password</label>
                    <div className="input-wrapper password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password2"
                        placeholder="Create a strong password"
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.password && <span className="field-error">{errors.password}</span>}
                  </div>

                  <div className="input-field">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-wrapper password-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                  </div>

                  <div className="checkbox-field">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        className="checkbox-input"
                        checked={registerData.agreeToTerms}
                        onChange={(e) => setRegisterData({...registerData, agreeToTerms: e.target.checked})}
                        disabled={isLoading}
                      />
                      <span className="checkbox-custom"></span>
                      <span className="checkbox-text">
                        I agree to the <a href="#" className="link">Terms of Service</a> and{' '}
                        <a href="#" className="link">Privacy Policy</a>
                      </span>
                    </label>
                    {errors.agreeToTerms && <span className="field-error">{errors.agreeToTerms}</span>}
                  </div>

                  <button 
                    type="submit" 
                    className="primary-button" 
                    disabled={isLoading}
                  >
                    <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                    {!isLoading && <div className="button-shine"></div>}
                  </button>

                  <div className="social-section">
                    <div className="divider">
                      <span>Or continue with</span>
                    </div>
                    <div className="social-buttons">
                      <button type="button" className="social-btn google" onClick={handleGoogleLogin} disabled={isLoading}>
                        <FontAwesomeIcon icon={faGoogle} />
                        <span>Google</span>
                      </button>
                      <button type="button" className="social-btn facebook" onClick={handleFacebookLogin} disabled={isLoading}>
                        <FontAwesomeIcon icon={faFacebookF} />
                        <span>Facebook</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}