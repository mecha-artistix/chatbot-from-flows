import { Typography, useTheme } from '@mui/material';

function Edges() {
  const theme = useTheme();
  return (
    <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
      Ttest
    </Typography>
  );
}

export default Edges;
