import { Theme } from '@mui/material';

declare global {
  interface LoginCreds {
    email: string;
    password: string;
  }
  interface SignupCreds {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }

  interface User {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  }
}

declare module '*.svg' {
  const content: string;
  export default content;
}

type ComponentKey = 'statBox' | 'statTitle' | 'wrapper' | 'container' | 'collapsable';

export type TSXHandler = (theme: Theme, component: ComponentKey) => Record<string, any>;

export {};
