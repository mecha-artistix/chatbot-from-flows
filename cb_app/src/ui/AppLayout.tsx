import { Box, Container, LinearProgress, Stack } from '@mui/material';
import TopBar from './components/TopBar';
import LeftPanel from './leftPanel/LeftPanel';
import { Outlet, useNavigation } from 'react-router-dom';

const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  const SxHandler = (theme, component) => {
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
    return style[component];
  };

  return (
    <Container maxWidth={false} disableGutters sx={(theme) => SxHandler(theme, 'wrapper')}>
      <Stack sx={(theme) => SxHandler(theme, 'container')} direction="column">
        <TopBar />
        <Box className="dashboard-cont" sx={(theme) => SxHandler(theme, 'bodySection')}>
          <LeftPanel />
          <Box sx={(theme) => SxHandler(theme, 'rightSection')}>{isLoading ? <LinearProgress /> : <Outlet />}</Box>
        </Box>
      </Stack>
    </Container>
  );
};

export default AppLayout;
