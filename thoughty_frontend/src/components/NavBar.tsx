import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faUserPlus,
  faUserClock,
  faBell,
  faPlus,
  faBrain,
  faGamepad,
  faCog,
  faSignOutAlt,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { usePodModal } from "../contexts/PodModalContext";
import { useAuth } from "../contexts/AuthContext";

import logo from "../assets/logo.png";
import userProfImage from "../assets/avatar-user-vector.jpg";

export type AuthStates = "SIGNED_OUT" | "GUEST" | "SIGNED_IN";

export const AuthStates = {
  SIGNED_OUT: "SIGNED_OUT",
  GUEST: "GUEST",
  SIGNED_IN: "SIGNED_IN",
} as const;

type Notification = {
  id: number;
  message: string;
  time: string; // could be ISO string or formatted already
  read: boolean;
};

function AuthLinks() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const requestType = params.get("request");

  return (
    <>
      <Link
        to="/auth?request=signin"
        className={`auth-btn ${
          requestType === "signin" ? "auth-btn-active" : "auth-btn-inactive"
        }`}
      >
        <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
        <span>Sign In</span>
        <div className="auth-btn-glow"></div>
      </Link>

      <Link
        to="/auth?request=signup"
        className={`auth-btn ${
          requestType === "signup" ? "auth-btn-active" : "auth-btn-inactive"
        }`}
      >
        <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
        <span>Sign Up</span>
        <div className="auth-btn-glow"></div>
      </Link>
    </>
  );
}

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, createGuestUser } = useAuth();
  const navigate = useNavigate();
  const { openModal } = usePodModal();

  // Determine auth state based on actual authentication
  let currentAuthState: AuthStates;
  if (!isAuthenticated) {
    currentAuthState = AuthStates.SIGNED_OUT;
  } else if (user?.is_guest) {
    currentAuthState = AuthStates.GUEST;
  } else {
    currentAuthState = AuthStates.SIGNED_IN;
  }

  // Dummy notifications; in real app fetch from API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Your pod 'AI Ideas' got a new comment",
      time: "2m ago",
      read: false,
    },
    {
      id: 2,
      message: "Weekly summary ready to view",
      time: "1h ago",
      read: false,
    },
    { id: 3, message: "Welcome to Thoughty!", time: "1d ago", read: true },
  ]);

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleItemClick = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // navigate or open notification action here
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGuestMode = async () => {
    try {
      await createGuestUser();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create guest user:', error);
    }
  };

  return (
    <nav className="fixed w-full z-50 glass-effect">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <NavLink to="/" className="flex items-center">
              <img src={logo} className="w-12 mx-3" />
              <span className="text-xl font-bold text-white pl-2">
                Thoughty
              </span>
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8 ">
              {/* nav-links */}
              {currentAuthState == AuthStates.SIGNED_OUT && (
                <NavLink
                  to="/"
                  className="nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium uppercase"
                >
                  Explore
                </NavLink>
              )}
              {currentAuthState == AuthStates.SIGNED_IN && (
                <>
                <NavLink
                  to="/dashboard"
                  className="nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium uppercase"
                >
                  Dashboard
                </NavLink>
              
              <NavLink
                to="/brainstorm"
                className="nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium uppercase"
              >
                Brainstorm
              </NavLink>
              <NavLink
                to="./battles"
                className="nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium uppercase"
              >
                Battles
              </NavLink>
              <NavLink
                to="/mentor"
                className="nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium uppercase"
              >
                Mind Mentor
              </NavLink>
              </>
              )}
              {currentAuthState == AuthStates.SIGNED_OUT && (
                <NavLink
                  to="/about"
                  className="nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium uppercase"
                >
                  About
                </NavLink>
              )}

              {/* signin & sign up btns */}
              {currentAuthState == AuthStates.SIGNED_OUT && (
                <>
                  <AuthLinks />
                  <div className="guest-btn-container">
                    <button onClick={handleGuestMode} className="guest-btn">
                      <FontAwesomeIcon icon={faUserClock} className="mr-2" />
                      guest mode
                    </button>
                  </div>
                </>
              )}
              {currentAuthState != AuthStates.SIGNED_OUT && (
                <>
                  {/* notification center */}
                  <div
                    ref={notifRef}
                    className="notification-container w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center cursor-pointer relative"
                  >
                    <button
                      onClick={() => setIsNotifOpen((prev) => !prev)}
                      className="w-full h-full flex items-center justify-center focus:outline-none"
                    >
                      <FontAwesomeIcon
                        icon={faBell}
                        className="text-primary-light notification-bell"
                      />
                      {unreadCount > 0 && (
                        <span className="notification-badge">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <div
                      className={`notification-dropdown ${
                        isNotifOpen ? "show" : ""
                      }`}
                    >
                      <div className="notification-header flex justify-between items-center">
                        <span>Notifications</span>
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAll}
                            className="notification-clear text-sm"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      <div className="notification-list max-h-80 overflow-y-auto thin-scrollbar">
                        {notifications.length === 0 && (
                          <div className="notification-empty">
                            No notifications
                          </div>
                        )}
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`notification-item ${
                              n.read ? "read" : "unread"
                            } cursor-pointer`}
                            onClick={() => handleItemClick(n.id)}
                          >
                            <div className="flex justify-between">
                              <span>{n.message}</span>
                              <span className="notification-time ml-2 whitespace-nowrap text-xs">
                                {n.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {notifications.length > 0 && unreadCount > 0 && (
                        <div className="text-center py-2 border-t border-input-br">
                          <button
                            onClick={markAllRead}
                            className="text-primary-light text-sm hover:text-primary"
                          >
                            Mark all as read
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* create pod button */}
                  <button
                    onClick={() => openModal()}
                    className="btn-hover inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white
                    pink-gradient-bg shadow-sm uppercase"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    New Pod
                  </button>

                  {/* dropdown user */}
                  <div className="profile-dropdown navbar-profile">
                    <button className="avatar-btn">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          className="avatar-img"
                          alt="Profile"
                        />
                      ) : (
                        <img
                          src={userProfImage}
                          className="avatar-img"
                          alt="Profile"
                        />
                      )}
                    </button>

                    <div className="dropdown-content">
                      <div className="dropdown-header">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            className="header-avatar"
                            alt="Profile"
                          />
                        ) : (
                          <img
                            src={userProfImage}
                            className="header-avatar"
                            alt="Profile"
                          />
                        )}
                        <div className="user-info">
                          <div className="user-name">{user?.username || user?.first_name + ' ' + user?.last_name || 'User'}</div>
                          <div className="user-email">{user?.email || 'user@example.com'}</div>
                          {user?.is_guest && (
                            <div className="text-xs text-accent mt-1">Guest User</div>
                          )}
                        </div>
                      </div>

                      <NavLink to="/pods" className="dropdown-item">
                        <FontAwesomeIcon icon={faBrain} />
                        <span>My ThoughtPods</span>
                      </NavLink>
                      <NavLink to="/gamify" className="dropdown-item">
                        <FontAwesomeIcon icon={faGamepad} /> <span>Gamify</span>
                      </NavLink>
                      <NavLink to="/settings" className="dropdown-item">
                        <FontAwesomeIcon icon={faCog} />
                        <span>Settings</span>
                      </NavLink>
                      <button onClick={handleLogout} className="dropdown-item w-full text-left">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                size="lg"
              />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div
        className={`md:hidden glass-effect transform transition-all duration-300 ease-out origin-top px-4 ${
          isMobileMenuOpen
            ? "scale-y-100 opacity-100 pt-4 pb-6 space-y-4"
            : "scale-y-0 opacity-0 h-0 overflow-hidden"
        }`}
      >
        {/* nav-links */}
        {currentAuthState == AuthStates.SIGNED_OUT && (
          <NavLink
            to="#"
            className="block nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium uppercase"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Explore
          </NavLink>
        )}
        {currentAuthState == AuthStates.SIGNED_IN && (
          <NavLink
            to="/dashboard"
            className="block nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium uppercase"
          >
            Dashboard
          </NavLink>
        )}
        <NavLink
          to="/brainstorm"
          className="block nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium uppercase"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Brainstorm
        </NavLink>
        <NavLink
          to="./battles"
          className="block nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium uppercase"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Battles
        </NavLink>
        <NavLink
          to="/mentor"
          className="block nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium uppercase"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Mind Mentor
        </NavLink>
        {currentAuthState == AuthStates.SIGNED_OUT && (
          <NavLink
            to="/about"
            className="block nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium uppercase"
          >
            About
          </NavLink>
        )}
        {currentAuthState == AuthStates.SIGNED_OUT && <AuthLinks />}
        {currentAuthState != AuthStates.SIGNED_OUT && (
          <>
            <button
              onClick={() => {
                openModal();
                setIsMobileMenuOpen(false);
              }}
              className="btn-hover block text-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white pink-gradient-bg shadow-sm uppercase"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              New Pod
            </button>
            <NavLink
              to="/pods"
              className="dropdown-item block w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faBrain} className="mr-2" /> My ThoughtPods
            </NavLink>
            <NavLink
              to="/gamify"
              className="dropdown-item block w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faGamepad} className="mr-2" /> Gamify
            </NavLink>
            <NavLink
              to="/settings"
              className="dropdown-item block w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faCog} className="mr-2" /> Settings
            </NavLink>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="dropdown-item block w-full text-left"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Log Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
