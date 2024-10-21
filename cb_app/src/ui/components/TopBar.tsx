import React from "react";
import ToggleTheme from "./ToggleTheme";
import {
  Avatar,
  List,
  Collapse,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  ClickAwayListener,
  ListItemIcon,
  Paper,
} from "@mui/material";
import useAuthStore from "../../features/authentication/userStore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import useThemeStore from "../../theme/themeStore";
import { logout } from "../../features/authentication/services";

function TopBar() {
  const [open, setOpen] = React.useState(false);
  const TopBarHeight = useThemeStore((state) => state.topBarHeight);
  const { username, setLoggedOut } = useAuthStore((state) => ({
    username: state.username,
    setLoggedOut: state.setLoggedOut,
  }));

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    setOpen(!open);
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      setLoggedOut();
      return response;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={(theme) => ({
        justifyContent: "flex-end",
        alignItems: "center",
        height: TopBarHeight,
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      {/* <SiteLogo /> */}

      <ToggleTheme />

      <Stack direction="row" sx={{ position: "relative" }}>
        <ListItemButton onClick={handleClick}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText primary={username} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Collapse
            in={open}
            sx={{
              position: "absolute",
              zIndex: 1,
              top: "100%",
              left: "0",
              width: "100%",
            }}
          >
            <Paper elevation={1}>
              <List>
                <ListItemButton>
                  <ListItemIcon>
                    <ManageAccountsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton onClick={handleLogout}>
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
