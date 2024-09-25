import * as React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import './App.css';
import Flowchart from './features/flowchart/Flowchart';
import useThemeStore from './theme/themeStore';
import { createMaterialTheme, joyTheme } from './theme/theme';
import { createJoyTheme } from './theme/theme';
import ToggleTheme from './ui/components/ToggleTheme';
import UserAuthPage from './features/authentication/components/UserAuthPage';
import Dashboard from './features/dashboard/Dashboard';

import LoginForm from './features/authentication/components/LoginForm';
import RegistrationForm from './features/authentication/components/RegistrationForm';
import NotFound from './features/notFound/NotFound';
import useAuthStore from './features/authentication/userStore';
import FlowchartsCollection, { loader as flowchartsLoader } from './features/flowchart/FlowchartsCollection';
import { action as CreateNewFlowchartAction } from './features/flowchart/components/CreateNewBtn';
import FlowBoard, { loader as FlowchartLoader } from './features/flowchart/components/FlowBoard';
import Knowledgebase from './features/knowledgebase/Knowledgebase';
import Bots from './features/bots/Bots';
import ProfileSettings from './features/userProfile/ProfileSettings';
import AccountSettings from './features/userProfile/components/AccountSettings';
import SecuritySettings from './features/userProfile/components/SecuritySettings';
import PaymentSettings from './features/userProfile/components/PaymentSettings';
import LeadsCollections, { loader as LeadsCollectionsLoader } from './features/leads/LeadsCollections';
import Sessions, { loader as sessionsLoader } from './features/leads/Sessions';
import AppLayout from './ui/AppLayout';
import Error from './ui/Error';
import Leads, { loader as LeadsLoader } from './features/leads/Leads';
import SessionsStats, { loader as sessionsStatsLoader } from './features/leads/components/SessionsStats';

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
};

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const jwtToken = getCookie('jwt');
  return jwtToken ? element : <Navigate to="/authentication/login" replace />;
};

const router = createBrowserRouter([
  {
    element: <ProtectedRoute element={<AppLayout />} />,
    errorElement: <Error />,
    children: [
      { path: '/', element: <Dashboard /> },
      {
        path: '/flowcharts',
        element: <FlowchartsCollection />,
        loader: flowchartsLoader,
        action: CreateNewFlowchartAction,
        errorElement: <Error />,
      },
      { path: '/create-flowchart', element: <FlowBoard />, loader: FlowchartLoader },
      { path: '/knowledgebase', element: <Knowledgebase /> },
      { path: '/bots', element: <Bots /> },
      {
        path: '/leads-collections',
        element: <LeadsCollections />,
        loader: LeadsCollectionsLoader,
        errorElement: <Error />,
      },
      {
        path: '/leads-collections/:id',
        element: <Leads />,
        loader: LeadsLoader,
        errorElement: <Error />,
      },
      {
        path: '/sessions',
        element: <Sessions />,
        loader: sessionsLoader,
        errorElement: <Error />,
        children: [{ index: true, element: <SessionsStats />, loader: sessionsStatsLoader }], // loader: sessionsStatsLoader
      },
      { path: '/user-profile', element: <ProfileSettings /> },
      {
        path: '/account-settings',
        element: <AccountSettings />,
        children: [
          { path: 'account-settings', element: <AccountSettings /> },
          { path: 'security-settings', element: <SecuritySettings /> },
          { path: 'payment-settings', element: <PaymentSettings /> },
        ],
      },
    ],
  },
  {
    path: '/authentication',
    element: <UserAuthPage />,
    children: [
      { path: 'login', element: <LoginForm /> },
      { path: 'sign-up', element: <RegistrationForm /> },
    ],
  },
]);

const App: React.FC = () => {
  const { mode, setMode } = useThemeStore((state) => ({
    mode: state.mode,
    setMode: state.setMode,
  }));
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  React.useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light');
    // setMode('light');
  }, [prefersDarkMode, setMode]);

  const materialTheme = createMaterialTheme(mode);

  return (
    <ThemeProvider theme={materialTheme}>
      <RouterProvider router={router} />
      <CssBaseline />
    </ThemeProvider>
  );
};

export default App;
