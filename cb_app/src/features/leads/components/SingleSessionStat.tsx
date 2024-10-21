import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import A from '../../../assets/img/icons_sessions/A.svg';
import CallBK from '../../../assets/img/icons_sessions/CALLBK.svg';
import DAIR from '../../../assets/img/icons_sessions/DAIR.svg';
import DNC from '../../../assets/img/icons_sessions/DNC.svg';
import DNQ from '../../../assets/img/icons_sessions/DNQ.svg';
import Hang_Up from '../../../assets/img/icons_sessions/Hang_Up.svg';
import LB from '../../../assets/img/icons_sessions/LB.svg';
import NI from '../../../assets/img/icons_sessions/NI.svg';
import NP from '../../../assets/img/icons_sessions/NP.svg';
import XFER from '../../../assets/img/icons_sessions/XFER.svg';
import total from '../../../assets/img/icons_sessions/All_Calls.svg';

import { IStat } from './SessionsStats';

const colors: { [key: string]: string } = {
  XFER: '#81c784',
  DAIR: '#F45151',
  DNQ: '#e57373',
  CallBK: '#FBE000',
  DNC: '#F9B040',
  NI: '#9789B5',
  NP: '#64B5F6',
  A: '#FCB6F1',
  Hang_Up: '#ABA88B',
  LB: '#BFAA6B',
  total: grey[200],
};

const icons: { [key: string]: string } = {
  XFER,
  DAIR,
  DNQ,
  CallBK,
  DNC,
  NI,
  NP,
  A,
  Hang_Up,
  LB,
  total,
};

interface ISingleSessionStat {
  total: number;
  intent: IStat;
  icon?: string;
}

const SingleSessionStat: React.FC<ISingleSessionStat> = ({ intent, icon }) => {
  return (
    <Paper
      sx={(theme) => ({
        width: 'clamp(100px, 100%, 130px)',
        py: 2,
        px: 1,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: intent.color || colors[intent.name],
        color: grey[900],
        textAlign: 'center',
      })}
      elevation={3}
      variant="elevation"
    >
      <Box
        sx={() => ({
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        })}
      >
        <Grid container>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent={'center'} gap={1}>
              <img src={icon || icons[intent.name]} width="24px" />
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '16px',
                }}
                fontSize={10}
              >
                {intent.name}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>{intent.value}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default SingleSessionStat;

/*
<Stack direction="row" alignItems="center" spacing={1}>
  <img src={icon || icons[intent.name]} width={30} />
  <Stack direction="column">
    <Typography sx={(theme) => styleHandler(theme, 'statTitle')} fontSize={10}>
      {intent.name}
    </Typography>
    <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>{intent.value}</Typography>
  </Stack>
</Stack>;
        <Box
          sx={(theme) => ({
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
            height: '16px',
            width: '100%',
            bgcolor: theme.palette.primary.main,
          })}
        >
          <Box
            sx={(theme) => ({
              position: 'absolute',
              bgcolor: theme.palette.primary.dark,
              height: '100%',
              width: statWidth + '%',
            })}
          ></Box>
          <Typography sx={{ fontSize: 14, mx: 1, color: 'white', position: 'absolute', right: 0, top: 0 }}>
            {statWidth} %
          </Typography>
        </Box>
*/
