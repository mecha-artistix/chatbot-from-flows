import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import FlowchartsCollection from '../flowchart/FlowchartsCollection';
import FlowBoard from '../flowchart/components/FlowBoard';
import Knowledgebase from '../knowledgebase/Knowledgebase';
import Bots from '../bots/Bots';
import LeadsStats from '../leads/LeadsStats';
import ProfileSettings from '../userProfile/ProfileSettings';
import AccountSettings from '../userProfile/components/AccountSettings';
import SecuritySettings from '../userProfile/components/SecuritySettings';
import PaymentSettings from '../userProfile/components/PaymentSettings';
import useAuthStore from '../authentication/userStore';
import { Box, Container, Grid, Stack, Drawer } from '@mui/material';
import LeftPanel from '../../ui/leftPanel/LeftPanel';
import TopBar from '../../ui/components/TopBar';
import LeadsData from '../leads/LeadsData';

const AuthenticatedApp: React.FC = () => {
  const navigate = useNavigate();

  const { isAuthenticated, verify } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    verify: state.verify,
  }));

  useEffect(() => {
    verify();
    // Check authentication and navigate accordingly
    if (!isAuthenticated) {
      navigate('/authentication/login');
    }
  }, [isAuthenticated, verify]);

  const style = {
    wrapper: {
      height: '100vh',
    },
    container: {
      height: '100%',
    },
    topSection: {},
    bodySection: {
      display: 'flex',
    },
    leftSection: {
      borderRight: 1,
    },

    rightSection: {
      height: 'calc(100vh - 70px)',
      overflowY: 'auto',
      flexGrow: 1,
    },
  };

  return (
    <Container maxWidth={false} disableGutters sx={style.wrapper}>
      <Stack sx={style.container} direction="column">
        {/* TOP BAR */}
        <TopBar />
        <Box className="dashboard-cont" sx={style.bodySection}>
          {/* LEFT PANEL HEADER */}

          <LeftPanel />

          {/* DASHBOARD */}
          <Box sx={style.rightSection}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/flowcharts" element={<FlowchartsCollection />} />
              <Route path="create-flowchart" element={<FlowBoard />} />
              <Route path="knowledgebase" element={<Knowledgebase />} />
              <Route path="bots" element={<Bots />} />
              <Route path="leads-data" element={<LeadsData />} />
              <Route path="leads-stats" element={<LeadsStats />} />
              <Route path="user-profile" element={<ProfileSettings />}>
                <Route index element={<AccountSettings />} />
                <Route path="account-settings" element={<AccountSettings />} />
                <Route path="security-settings" element={<SecuritySettings />} />
                <Route path="payment-settings" element={<PaymentSettings />} />
              </Route>
            </Routes>
          </Box>
        </Box>
      </Stack>
    </Container>
  );
};

export default AuthenticatedApp;
