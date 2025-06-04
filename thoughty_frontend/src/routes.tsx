import type { RouteObject } from 'react-router-dom'
import Layout from './routes/_layout'
import Home from './routes/index'
import About from './routes/about'
import Auth from './routes/auth'
import NotFound from './routes/404'
import Dashboard from './routes/dashboard'
import Gamify from './routes/gamify'
import Mentor from './routes/mentor'
import Pods from './routes/pods'
import Brainstorm from './routes/brainstorm'
import Battles from './routes/battles'
import BattleView from './routes/battle-view'
import PrivacyPolicy from './routes/privacy-policy'
import TermsOfService from './routes/terms-of-service'
import CookiePolicy from './routes/cookie-policy'
import ProtectedRoute from './components/ProtectedRoute'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { 
        path: 'dashboard', 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'pods', 
        element: (
          <ProtectedRoute>
            <Pods />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'brainstorm', 
        element: (
          <ProtectedRoute>
            <Brainstorm />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'battles', 
        element: (
          <ProtectedRoute>
            <Battles />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'battles/:battleId', 
        element: (
          <ProtectedRoute>
            <BattleView />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'gamify', 
        element: (
          <ProtectedRoute>
            <Gamify />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'mentor', 
        element: (
          <ProtectedRoute>
            <Mentor />
          </ProtectedRoute>
        ) 
      },
      { path: 'about', element: <About /> },
      { path: 'auth', element: <Auth /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms-of-service', element: <TermsOfService /> },
      { path: 'cookie-policy', element: <CookiePolicy /> },
    ],
  },
  // Catch-all route for 404 - should be last
  {
    path: '*',
    element: <NotFound />,
  },
]

export default routes