import { IconButton } from '@mui/material';
import useThemeStore from '../../theme/themeStore';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

function ToggleTheme() {
  const { mode, toggleTheme } = useThemeStore((state) => ({
    mode: state.mode,
    toggleTheme: state.toggleTheme,
  }));

  return <IconButton onClick={() => toggleTheme()}>{mode == 'dark' ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>;
}

export default ToggleTheme;
