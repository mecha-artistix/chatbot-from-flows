import { Stack } from '@mui/material';
import ImportFileBtn from './ImportFileBtn';
import CreateNewBtn from './CreateNewBtn';

function TopControlBar() {
  const style = {
    container: {
      margin: '20px auto',
      p: 2,
      //   width: 'clamp(500px, 90%, 800px)',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: 2,
    },
  };
  return (
    <Stack direction="row" sx={style.container}>
      <CreateNewBtn />
      <ImportFileBtn />
    </Stack>
  );
}

export default TopControlBar;
