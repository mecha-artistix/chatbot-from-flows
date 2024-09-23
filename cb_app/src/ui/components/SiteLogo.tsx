import * as React from 'react';
import { ListItem, ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import LogoLight from '../../assets/LogoLight.svg';
import LogoDark from '../../assets/LogoDark.svg';
import useThemeStore from '../../theme/themeStore';

const SiteLogo: React.FC = () => {
  const { mode, leftDrawerOpen } = useThemeStore((state) => ({
    mode: state.mode,
    leftDrawerOpen: state.leftDrawerOpen,
  }));

  const style = {
    container: {
      cursor: 'pointer',
    },
    img: {},
    title: {
      fontSize: { sm: '0.6rem', md: '0.8rem', lg: '1rem' },
    },
  };

  return (
    <Stack direction="row" sx={style.container}>
      <ListItem disablePadding>
        <ListItemIcon>
          <img src={mode == 'light' ? LogoLight : LogoDark} alt="Logo" />
        </ListItemIcon>
        <ListItemText
          primary={
            leftDrawerOpen && (
              <Typography sx={style.title} variant="siteTitle">
                {import.meta.env.VITE_SITE_NAME}
              </Typography>
            )
          }
        />
      </ListItem>
    </Stack>
  );
};

export default SiteLogo;
