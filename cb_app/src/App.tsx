import * as React from "react";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./App.css";
import useThemeStore from "./theme/themeStore";
import { createMaterialTheme } from "./theme/theme";
import UserAuthPage from "./features/authentication/components/UserAuthPage";
import Dashboard from "./features/dashboard/Dashboard";
import LoginForm, { action as loginAction } from "./features/authentication/components/LoginForm";
import RegistrationForm, { action as signUpAction } from "./features/authentication/components/RegistrationForm";
import FlowchartsCollection, { loader as flowchartsLoader } from "./features/flowchart/FlowchartsCollection";
import { action as CreateNewFlowchartAction } from "./features/flowchart/components/CreateNewBtn";
import Flowchart, { loader as FlowchartLoader } from "./features/flowchart/Flowchart";
// import ChatBox, { loader as ChatBoxLoader } from './features/chatBox/ChatBox';
import Knowledgebase from "./features/knowledgebase/Knowledgebase";
import Bots from "./features/bots/Bots";
import ProfileSettings from "./features/userProfile/ProfileSettings";
import AccountSettings from "./features/userProfile/components/AccountSettings";
import SecuritySettings from "./features/userProfile/components/SecuritySettings";
import PaymentSettings from "./features/userProfile/components/PaymentSettings";
import LeadsCollections, { loader as LeadsCollectionsLoader } from "./features/leads/LeadsCollections";
import Sessions, { loader as sessionsLoader } from "./features/leads/Sessions";
import AppLayout from "./ui/AppLayout";
import Error from "./ui/Error";
import Leads, { loader as LeadsLoader } from "./features/leads/Leads";
import SessionsStats from "./features/leads/components/SessionsStats";
import useAuthStore from "./features/authentication/userStore";

// const getCookie = (name: string) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(';').shift();
// };

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useAuthStore((state) => ({ isAuthenticated: state.isAuthenticated }));
  // console.log('ProtectedRoute called');
  // const jwtToken = getCookie('jwt');

  // (async function () {
  //   try {
  //     const response = await verify();
  //     return response;
  //   } catch (error) {
  //     return error;
  //   }
  // })();

  // console.log(jwtToken);
  // return jwtToken ? element : <Navigate to="/authentication/login" replace />;
  return isAuthenticated ? element : <Navigate to="/authentication/login" replace />;
};

const router = createBrowserRouter([
  {
    element: <ProtectedRoute element={<AppLayout />} />,
    // errorElement: <Error />,
    children: [
      { path: "/", element: <Dashboard />, errorElement: <Error /> },
      {
        path: "/flowcharts",
        element: <FlowchartsCollection />,
        loader: flowchartsLoader,
        action: CreateNewFlowchartAction,
        errorElement: <Error />,
      },
      { path: "/create-flowchart", element: <Flowchart />, loader: FlowchartLoader },
      { path: "/knowledgebase", element: <Knowledgebase /> },
      { path: "/bots", element: <Bots /> },
      {
        path: "/leads-collections",
        element: <LeadsCollections />,
        loader: LeadsCollectionsLoader,
        errorElement: <Error />,
      },
      {
        path: "/leads-collections/:id",
        element: <Leads />,
        loader: LeadsLoader,
        errorElement: <Error />,
      },
      {
        path: "/sessions",
        element: <Sessions />,
        loader: sessionsLoader,
        errorElement: <Error />,
        children: [{ index: true, element: <SessionsStats /> }], // loader: sessionsStatsLoader
      },
      {
        path: "/user-profile",
        element: <ProfileSettings />,
        errorElement: <Error />,
        children: [
          { index: true, element: <ProfileSettings /> },
          { path: "account-settings", element: <AccountSettings /> },
          { path: "security-settings", element: <SecuritySettings /> },
          { path: "payment-settings", element: <PaymentSettings /> },
        ],
      },
    ],
  },
  {
    path: "/authentication",
    element: <UserAuthPage />,
    children: [
      { path: "login", element: <LoginForm />, action: loginAction },
      { path: "sign-up", element: <RegistrationForm />, action: signUpAction },
    ],
  },
]);

const App: React.FC = () => {
  const { mode, setMode } = useThemeStore((state) => ({
    mode: state.mode,
    setMode: state.setMode,
  }));
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  React.useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
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
