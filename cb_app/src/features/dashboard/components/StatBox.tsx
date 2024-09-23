import { Box, Paper, Stack, Typography } from '@mui/material';
import useLeadsStore from '../../leads/leadsStore';
import { useEffect, useState } from 'react';

const StatBox = ({ name, stat, icon }) => {
  const { leadsCount, getLeadsStatus, leadsStatus } = useLeadsStore((state) => ({
    leadsCount: state.leadsCount,
    getLeadsStatus: state.getLeadsStatus,
    leadsStatus: state.leadsStatus,
  }));
  const [stateWidth, setStateWidth] = useState(0);

  const styleHandler = (theme, component) => {
    const style = {
      statBox: {
        // width: 40,
        flex: 1,
        p: 1,
        height: '200px',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      },
      statTitle: {
        fontWeight: 400,
      },
    };
    return style[component];
  };

  useEffect(() => {
    getLeadsStatus();
  }, []);

  useEffect(() => {
    setStateWidth(() => ((100 * leadsStatus[stat]) / leadsStatus.total_leads).toFixed(2));
  }, [leadsStatus]);

  return (
    <Paper sx={(theme) => styleHandler(theme, 'statBox')} elevation={10}>
      <Box
        sx={(theme) => ({
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        })}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon}
          <Stack direction="column">
            <Typography variant="h4" sx={(theme) => styleHandler(theme, 'statTitle')}>
              {name}
            </Typography>
            <Typography variant="h3"> {leadsStatus[stat]}</Typography>
          </Stack>
        </Stack>
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
              width: stateWidth + '%',
            })}
          ></Box>
          <Typography sx={{ fontSize: 14, mx: 1, color: 'white', position: 'absolute', right: 0, top: 0 }}>
            {stateWidth} %
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default StatBox;
