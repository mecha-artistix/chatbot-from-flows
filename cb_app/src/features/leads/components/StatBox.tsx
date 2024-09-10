import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import useLeadsStore from '../leadsStore';

const StatBox = ({ name, stat, icon }) => {
  const { leadsCount } = useLeadsStore((state) => ({ leadsCount: state.leadsCount }));

  const styleHandler = (theme, component) => {
    const style = {
      statBox: {
        flex: 1,
        p: 1,
        height: '200px',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.primary.light,
      },
      statTitle: {
        fontWeight: 400,
      },
    };
    return style[component];
  };

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
          <Typography variant="h4" sx={(theme) => styleHandler(theme, 'statTitle')}>
            {name}
          </Typography>
        </Stack>
        <Box
          sx={(theme) => ({
            overflow: 'hidden',
            borderRadius: 2,
            height: '10px',
            width: '100%',
            bgcolor: theme.palette.primary.main,
          })}
        >
          <Box sx={(theme) => ({ bgcolor: theme.palette.primary.dark, height: '100%', width: '50%' })}></Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default StatBox;
