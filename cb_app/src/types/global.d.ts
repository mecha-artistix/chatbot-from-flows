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

export {};
