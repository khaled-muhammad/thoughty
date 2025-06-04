import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { PodModalProvider } from './contexts/PodModalContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import GlobalPodModal from './components/GlobalPodModal';

// Placeholder components for demonstration
const HomePage = () => (
  <div className="min-h-screen bg-darker flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-light mb-4">Welcome to Thoughty</h1>
      <p className="text-gray-400">Organize your thoughts, engage with ideas.</p>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="min-h-screen bg-darker p-8">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-light mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card-bg/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold text-light mb-4">Your Pods</h3>
          <p className="text-gray-400">Manage your thought pods here.</p>
        </div>
        <div className="bg-card-bg/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold text-light mb-4">Recent Activity</h3>
          <p className="text-gray-400">See what's happening in your network.</p>
        </div>
        <div className="bg-card-bg/50 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold text-light mb-4">Brainstorm</h3>
          <p className="text-gray-400">Start a new brainstorming session.</p>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <PodModalProvider>
          <div className="min-h-screen bg-darker">
            <Navbar />
            
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              
              {/* Auth routes - redirect if already authenticated */}
              <Route 
                path="/login" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <LoginForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <RegisterForm />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected routes - require authentication */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pods" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/battles" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/brainstorm" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>

            {/* Global components */}
            <GlobalPodModal />
            
            {/* Toast notifications */}
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
              toastStyle={{
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
              }}
            />
      </div>
        </PodModalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
