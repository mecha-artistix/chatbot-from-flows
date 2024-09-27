import { Theme } from '@mui/material';
import React, { CSSProperties } from 'react';
import { SxProps } from '@mui/system';
export interface SXHandlerReturn {
  styles: Record<string, CSSProperties>; // Allows any string key
  result: CSSProperties | undefined;
}

export type Styles = Record<string, CSSProperties>;

// export type SXHandler = (theme: Theme, component: string) => SXHandlerReturn;

export type SXHandler = (theme: Theme, component: string) => SxProps<Theme>;

export type THandleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => void;
export type THandleClickEvent = (e: React.MouseEventHandler<HTMLButtonElement>) => void;

export type THandleSubmit = (e: React.FormEvent<HTMLFormElement>) => void;
