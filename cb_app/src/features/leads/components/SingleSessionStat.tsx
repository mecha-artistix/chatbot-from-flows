import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { useEffect, useState } from 'react';

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

const colors = {
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
};

const icons = {
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
};

function SingleSessionStat({ total, intent, icon }) {
  const [statWidth, setStatWidth] = useState();

  const styleHandler = (theme, component) => {
    const style = {
      statBox: {
        width: 'clamp(100px, 100%, 130px)',
        // flex: '1 1 auto',
        py: 2,
        px: 1,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: intent.color || colors[intent.name],
        color: grey[900],
        textAlign: 'center',
      },
      statTitle: {
        fontWeight: 600,
        fontSize: '16px',
      },
    };
    return style[component];
  };

  useEffect(() => {
    setStatWidth(() => ((100 * intent.value) / total).toFixed(2));
  }, [total]);

  return (
    <Paper sx={(theme) => styleHandler(theme, 'statBox')} elevation={3} variant="elevation">
      <Box
        sx={(theme) => ({
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
              <Typography sx={(theme) => styleHandler(theme, 'statTitle')} fontSize={10}>
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
}

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
