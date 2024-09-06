import React from 'react';
import ToggleTheme from './ToggleTheme';
import {
  Avatar,
  List,
  Collapse,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
  ClickAwayListener,
  ListItem,
  ListItemIcon,
  Paper,
} from '@mui/material';
import SiteLogo from './SiteLogo';
import useAuthStore from '../features/authentication/userStore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useThemeStore } from '../theme/themeStore';

function TopBar() {
  const [open, setOpen] = React.useState(false);
  const TopBarHeight = useThemeStore((state) => state.topBarHeight);
  const { username, logout } = useAuthStore((state) => ({ username: state.username, logout: state.logout }));

  const handleClick = (event) => {
    event.stopPropagation();
    setOpen(!open);
  };
  const style = {
    wrapper: {
      justifyContent: 'flex-end',
      height: TopBarHeight,
    },
    collapsable: {
      position: 'absolute',
      zIndex: 1,
      top: '100%',
      left: '0',
      width: '100%',
    },
  };
  const sxHandler = (theme, component) => {
    const styles = {
      wrapper: {
        justifyContent: 'flex-end',
        height: TopBarHeight,
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
      collapsable: {
        position: 'absolute',
        zIndex: 1,
        top: '100%',
        left: '0',
        width: '100%',
      },
    };
    return styles[component];
  };
  return (
    <Stack direction="row" spacing={1} sx={(theme) => sxHandler(theme, 'wrapper')}>
      {/* <SiteLogo /> */}

      <ToggleTheme />

      <Stack direction="row" sx={{ position: 'relative' }}>
        <ListItemButton onClick={handleClick}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText primary={username} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Collapse in={open} sx={(theme) => sxHandler(theme, 'collapsable')}>
            <Paper elevation={1}>
              <List>
                <ListItemButton>
                  <ListItemIcon>
                    <ManageAccountsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton onClick={() => logout()}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sign Out" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemIcon>
                    <ToggleTheme />
                  </ListItemIcon>
                </ListItemButton>
              </List>
            </Paper>
          </Collapse>
        </ClickAwayListener>
      </Stack>
    </Stack>
  );
}

export default TopBar;
