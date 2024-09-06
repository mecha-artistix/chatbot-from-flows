import { Drawer, Stack, Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Navigation from './Navigation';
import SettingsNavigation from './SettingsNavigation';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import React, { useState } from 'react';
import { useThemeStore } from '../../theme/themeStore';
import SiteLogo from '../../components/SiteLogo';
function LeftPanel() {
  const { leftDrawerOpen, leftDrawerWidth, topBarHeight } = useThemeStore((state) => ({
    leftDrawerOpen: state.leftDrawerOpen,
    leftDrawerWidth: state.leftDrawerWidth,
    topBarHeight: state.topBarHeight,
  }));

  const style = {
    container: {
      display: 'flex',
    },
    drawer: {
      width: leftDrawerWidth,
    },
    PaperProps: {
      pt: 2,
      // p: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      width: leftDrawerWidth,
      overflowX: 'hidden',
      transition: 'width 0.3s ease',
      transform: 'none !important',
      visibility: 'visible !important',
    },
  };
  return (
    <Box sx={style.container}>
      <Drawer
        variant="persistent"
        open={leftDrawerOpen}
        sx={style.drawer}
        PaperProps={{
          sx: { ...style.PaperProps },
        }}
      >
        {/* <Box sx={{ height: TopBarHeight, borderBottom: 1 }}> */}
        <SiteLogo />
        {/* </Box> */}
        <Stack sx={{ flexGrow: 1, width: '100%' }}>
          <Navigation />
          <SettingsNavigation />
        </Stack>
        <ToggleDrawer />
      </Drawer>
    </Box>
  );
}
export default LeftPanel;

const ToggleDrawer: React.FC<ToggleDrawerProps> = ({ isFixed }) => {
  const { leftDrawerOpen, setLeftDrawerOpen } = useThemeStore((state) => ({
    leftDrawerOpen: state.leftDrawerOpen,
    setLeftDrawerOpen: state.setLeftDrawerOpen,
  }));
  const style = isFixed
    ? {
        marginTop: 'auto',
        position: 'fixed',
        bottom: 0,
      }
    : {};
  return (
    <Box sx={style}>
      <ListItemButton onClick={setLeftDrawerOpen}>
        <ListItemIcon>
          {leftDrawerOpen ? (
            <UnfoldLessIcon sx={{ transform: 'rotate(90deg)' }} />
          ) : (
            <UnfoldMoreIcon sx={{ transform: 'rotate(90deg)' }} />
          )}
        </ListItemIcon>
        <ListItemText primary={leftDrawerOpen && 'Collapse'} />
      </ListItemButton>
    </Box>
  );
};

interface ToggleDrawerProps {
  isFixed?: boolean;
}
