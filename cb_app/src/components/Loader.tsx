import { useTheme } from '@mui/material';
import styles from './loader.module.css';

function Loader() {
  const theme = useTheme();
  return <div className={styles.loader} style={{ color: theme.palette.primary.main }}></div>;
}

export default Loader;
