import { Button, IconButton } from '@mui/material';
import { useThemeStore } from '../theme/themeStore';
import useAuthStore from '../features/authentication/userStore';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

function ToggleTheme() {
  const verify = useAuthStore((state) => state.verify);
  const { mode, toggleTheme } = useThemeStore((state) => ({
    mode: state.mode,
    toggleTheme: state.toggleTheme,
  }));

  const style = {
    position: 'absolute',
    top: 0,
    right: '50%',
  };
  const clickHandler = () => {
    // verify();
    toggleTheme();
  };
  return <IconButton onClick={clickHandler}>{mode == 'dark' ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>;
}

export default ToggleTheme;
