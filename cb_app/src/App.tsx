import * as React from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import './App.css';
import Flowchart from './features/flowchart/Flowchart';
import { useThemeStore } from './theme/themeStore';
import { createMaterialTheme, joyTheme } from './theme/theme';
import { createJoyTheme } from './theme/theme';
import ToggleTheme from './components/ToggleTheme';
import UserAuthPage from './features/authentication/components/UserAuthPage';
import Dashboard from './features/dashboard/Dashboard';

import LoginForm from './features/authentication/components/LoginForm';
import RegistrationForm from './features/authentication/components/RegistrationForm';
import NotFound from './features/notFound/NotFound';
import useAuthStore from './features/authentication/userStore';
import FlowchartsCollection from './features/flowchart/FlowchartsCollection';
import FlowBoard from './features/flowchart/components/FlowBoard';
import Knowledgebase from './features/knowledgebase/Knowledgebase';
import Bots from './features/bots/Bots';
import Leads from './features/leads/Leads';
import ProfileSettings from './features/userProfile/ProfileSettings';
import AccountSettings from './features/userProfile/components/AccountSettings';
import SecuritySettings from './features/userProfile/components/SecuritySettings';
import PaymentSettings from './features/userProfile/components/PaymentSettings';
import AuthenticatedApp from './features/authenticatedApp/AuthenticatedApp';

const App: React.FC = () => {
  const { mode, setMode } = useThemeStore((state) => ({
    mode: state.mode,
    setMode: state.setMode,
  }));
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  React.useEffect(() => {
    // setMode(prefersDarkMode ? 'dark' : 'light');
    setMode('light');
  }, [prefersDarkMode, setMode]);

  const materialTheme = createMaterialTheme(mode);

  return (
    <ThemeProvider theme={materialTheme}>
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          <Route path="/authentication" element={<UserAuthPage />}>
            <Route path="login" index element={<LoginForm />} />
            <Route path="sign-up" element={<RegistrationForm />} />
          </Route>
          <Route path="/*" element={<AuthenticatedApp />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

// const AuthenticatedApp = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated, verify } = useAuthStore((state) => ({
//     isAuthenticated: state.isAuthenticated,
//     verify: state.verify,
//   }));

//   React.useEffect(() => {
//     verify();
//     // Check authentication and navigate accordingly
//     if (!isAuthenticated) {
//       navigate("/authentication/login");
//     }
//   }, [isAuthenticated, verify]);

//   return (
//     <Routes>
//       <Route path="/" element={<Dashboard />} />
//       <Route path="flowcharts" element={<FlowchartsCollection />} />
//       <Route path="create-flowchart" element={<FlowBoard />} />
//       <Route path="knowledgebase" element={<Knowledgebase />} />
//       <Route path="bots" element={<Bots />} />
//       <Route path="leads" element={<Leads />} />
//       <Route path="user-profile" element={<ProfileSettings />}>
//         <Route index element={<AccountSettings />} />
//         <Route path="account-settings" element={<AccountSettings />} />
//         <Route path="security-settings" element={<SecuritySettings />} />
//         <Route path="payment-settings" element={<PaymentSettings />} />
//       </Route>
//     </Routes>
//   );
// };

export default App;

const Authenticate = () => {
  return (
    <Routes>
      <Route path="/authentication" element={<UserAuthPage />}>
        <Route path="login" index element={<LoginForm />} />
        <Route path="sign-up" element={<RegistrationForm />} />
      </Route>
      <Route path="/*" element={<AuthenticatedApp />} />
    </Routes>
  );
};
