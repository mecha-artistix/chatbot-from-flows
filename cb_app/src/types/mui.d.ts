import '@mui/material/styles';
import { TypographyProps } from '@mui/material/Typography';
import { PaletteOptions, SimplePaletteColorOptions, PaletteColorOptions } from '@mui/material/styles';

// Extend the MUI Typography variants with custom variant
declare module '@mui/material/styles' {
  interface TypographyVariants {
    siteTitle: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    siteTitle?: React.CSSProperties;
  }
}

// Extend the TypographyProps to allow using siteTitle variant in the component
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    siteTitle: true;
  }
}

declare module '@mui/material/styles' {
  export interface Palette {
    accent: PaletteColorOptions;
    bgNode: Partial;
  }

  export interface PaletteOptions {
    accent?: PaletteColorOptions;
    bgNode: Partial;
  }
}
