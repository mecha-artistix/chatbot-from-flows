import '@mui/material/styles';
import { PaletteOptions, SimplePaletteColorOptions, TypographyVariants } from '@mui/material/styles';
import { blue, red, green, grey, amber } from '@mui/material/colors';
import { TypographyOptions } from '@mui/material/styles/createTypography';

export const typography: TypographyOptions = {
  fontFamily: `'Lato', sans-serif`,
  h1: {
    fontSize: '5rem',
    fontWeight: 800,
  },
  h2: {
    fontSize: '4rem',
    fontWeight: 800,
  },
  h3: {
    fontSize: '2rem',
  },
  h4: {
    fontSize: '1.5rem',
  },
  h5: {
    fontSize: '1.25rem',
  },
  h6: {
    fontSize: '1rem',
  },
  siteTitle: {
    fontFamily: `'Press Start 2P', Arial, sans-serif`,
    fontSize: '1rem',
    fontWeight: 700,
  },
  subtitle1: {
    fontSize: '0.875rem',
    fontWeight: 'light',
    opacity: '0.7',
    textTransform: 'capitalize',
  },
  subtitle2: {
    fontSize: '0.775rem',
    fontWeight: 500,
    opacity: '1',
    textTransform: 'uppercase',
    letterSpacing: '1rem',
  },
  body1: {},
  body2: {},
  caption: {},
  button: {},
  overline: {},
};

export const palette: PaletteOptions = {
  primary: {
    light: blue[300],
    main: blue[500],
    dark: blue[900],
    contrastText: grey[50],
  } as SimplePaletteColorOptions,
  secondary: {
    light: '#ff7961',
    main: '#BFAA6B',
    dark: '#ba000d',
    contrastText: '#000',
  } as SimplePaletteColorOptions,
  accent: {
    light: amber[300],
    main: amber[500],
    dark: amber[900],
    contrastText: amber[50],
  } as SimplePaletteColorOptions,
  bgNode: {
    start: blue[500],
    positive: green[100],
    neutral: blue[100],
    negative: red[100],
  },
};

export const lightMode: PaletteOptions = {
  mode: 'light',
  primary: {
    light: blue[300],
    main: blue[600],
    dark: blue[900],
    contrastText: grey[50],
  } as SimplePaletteColorOptions,
  background: {
    default: grey[50],
    paper: grey[100],
  },
};

export const darkMode: PaletteOptions = {
  mode: 'dark',
  primary: {
    light: blue[300],
    main: blue[800],
    dark: blue[900],
    contrastText: grey[50],
  } as SimplePaletteColorOptions,
  background: {
    default: grey[900],
    paper: grey[900],
  },
};

export const spacing = {
  small: 1,
  medium: 3,
  large: 5,
};
