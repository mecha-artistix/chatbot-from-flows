import { Theme } from '@mui/material';
import { CSSProperties } from 'react';
import { SxProps } from '@mui/system';
export interface SXHandlerReturn {
  styles: Record<string, CSSProperties>; // Allows any string key
  result: CSSProperties | undefined;
}

export type Styles = Record<string, CSSProperties>;

// export type SXHandler = (theme: Theme, component: string) => SXHandlerReturn;

export type SXHandler = (theme: Theme, component: string) => SxProps<Theme>;
