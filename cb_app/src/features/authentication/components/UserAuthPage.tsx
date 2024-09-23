import { Outlet } from 'react-router-dom';
import { Box, Stack, Container, Grid, Typography } from '@mui/material';
import SiteLogo from '../../../ui/components/SiteLogo';
import BotImg from '../../../assets/img/robot_hi.svg';

function UserAuthPage() {
  const style = {
    section: {
      // mt: 10,
      minHeight: '100vh',
      margin: 'auto',
    },
    grid: {
      padding: '0px 9vw',
      justifyContent: 'space-around',
      height: '100vh',
      alignItems: 'center',
    },
    col: {
      span: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    form: { width: '100%' },
  };
  return (
    // <Container sx={style.section} component="section">
    <Grid container sx={style.grid}>
      <Grid item xs={12} sm={6} md={5} lg={5}>
        <Stack sx={style.col} spacing={4}>
          <SiteLogo />
          <Typography variant="subtitle2" textAlign="center">
            24/7 at your service
          </Typography>
          <img src={BotImg} width="100%" height="400px" />
        </Stack>
      </Grid>
      <Grid item xs={12} sm={6} md={5} lg={5}>
        <Stack sx={style.col}>
          <Box sx={style.form}>
            <Outlet />
          </Box>
        </Stack>
      </Grid>
    </Grid>
    // </Container>
  );
}

export default UserAuthPage;
