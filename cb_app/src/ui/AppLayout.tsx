import { Box, Container, LinearProgress, Stack } from '@mui/material';
import TopBar from './components/TopBar';
import LeftPanel from './leftPanel/LeftPanel';
import { Outlet, useNavigation } from 'react-router-dom';
import ChatBox from '../features/chatBox/ChatBox';

const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '100vh',
      }}
    >
      <Stack sx={{ height: '100%' }} direction="column">
        <TopBar />
        <Box className="dashboard-cont" sx={{ display: 'flex' }}>
          <LeftPanel />
          <Box sx={{ height: 'calc(100vh - 70px)', overflowY: 'auto', flexGrow: 1 }}>
            {isLoading ? <LinearProgress /> : <Outlet />}
          </Box>
          <ChatBox />
        </Box>
      </Stack>
    </Container>
  );
};

export default AppLayout;
