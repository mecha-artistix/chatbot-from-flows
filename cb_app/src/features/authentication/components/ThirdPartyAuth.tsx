import React from "react";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";

const ThirdPartyAuth: React.FC = () => {
  const thirdParties = [
    { name: "Google", icon: <GoogleIcon /> },
    { name: "Facebook", icon: <FacebookIcon /> },
  ];
  const style = {
    border: "1px solid",
  };
  return (
    <Stack direction="row">
      {thirdParties.map((el, i) => (
        <ListItem disablePadding key={i} sx={style}>
          <ListItemButton>
            <ListItemIcon>{el.icon}</ListItemIcon>
            <ListItemText primary={el.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </Stack>
  );
};

export default ThirdPartyAuth;
