import { createTheme, responsiveFontSizes, ThemeOptions, Theme } from '@mui/material/styles';
import { typography, palette, lightMode, darkMode } from './constants';

// Create the theme based on the mode passed as an argument
export const createAppTheme = (mode: 'light' | 'dark'): Theme => {
  const themeOptions: ThemeOptions = {
    palette: {
      ...palette,
      ...(mode === 'light' ? lightMode : darkMode),
    },
    typography,
    components: {
      MuiButton: {
        styleOverrides: {
          root: { zIndex: 0, bgColor: 'pink', fontSize: ' 0.8rem' },
        },
      },
    },
  };

  return responsiveFontSizes(createTheme(themeOptions));
};
/*
    components: {
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          body: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            transition: "background-color 0.3s ease",
          },
          h1: {
            ...theme.typography.h1,
            color: theme.palette.primary.main,
          },
        }),
      },
      // override other components similarly...
    },
*/
// export const createAppTheme = (mode) =>
//     responsiveFontSizes(
//       createTheme({
//         ...baseConfig,
//         palette: {
//           ...baseConfig.palette,
//           ...(mode === 'light' ? lightMode.palette : darkMode.palette),
//         },
//         border: {
//           thick: '4px solid #000',
//           thin: `1px solid
//           ${mode == 'dark' ? darkMode.palette.bgcard.main : lightMode.palette.bgcard.main}`,
//         },
//         components: {
//           MuiCssBaseline: {
//             styleOverrides: (theme) => ({
//               '.section-container': {
//                 marginBottom: 'clamp(40px, 60px, 80px)',
//               },
//               '.active': {},
//             }),
//           },

//         },
//         customShadows: {},
//       }),
//       {
//         breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
//         factor: 2,
//       }
//     );
