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

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'pods', element: <Pods /> },
      { path: 'brainstorm', element: <Brainstorm /> },
      { path: 'battles', element: <Battles /> },
      { path: 'battles/:battleId', element: <BattleView /> },
      { path: 'gamify', element: <Gamify /> },
      { path: 'mentor', element: <Mentor /> },
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