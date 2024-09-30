import * as React from 'react';
import {
  List,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ClickAwayListener,
  Collapse,
  Link,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SecurityIcon from '@mui/icons-material/Security';
import PaidIcon from '@mui/icons-material/Paid';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { NavLink as RouterLink, useNavigate } from 'react-router-dom';

function SettingsNavigation() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
    event.stopPropagation();
    setOpen((prev) => !prev);
    event.preventDefault();
    navigate('/user-profile');
  };
  const links = [
    { name: 'Account Settings', link: 'account-settings', icon: <ManageAccountsIcon /> },
    { name: 'Security Settings', link: 'security-settings', icon: <SecurityIcon /> },
    { name: 'Payment Settings', link: 'payment-settings', icon: <PaidIcon /> },
  ];
  return (
    <Box sx={{ mt: 'auto' }}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {links.map((link, i) => (
              <Link
                key={i}
                component={RouterLink}
                to={`user-profile/${link.link}`}
                underline="none"
                color="textSecondary"
              >
                <ListItemButton>
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.name} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Collapse>
      </ClickAwayListener>
      {/* <Link component={RouterLink} to="user-profile"> */}
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
        {open ? <ExpandMore /> : <ExpandLess />}
      </ListItemButton>
    </Box>
  );
}

export default SettingsNavigation;
