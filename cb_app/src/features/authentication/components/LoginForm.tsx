import { TextField, Stack, Button, Typography, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import useAuthStore from '../userStore';
import { ActionFunction, Form, json, NavLink, redirect, useActionData } from 'react-router-dom';
import ThirdPartyAuth from './ThirdPartyAuth';
import PasswordField from '../../../components/PasswordField';
import { login, verify } from '../services';

const LoginForm: React.FC = () => {
  const action = useActionData() as { [key: string]: any };

  const [creds, setCreds] = useState<LoginCreds>({
    email: 'johndoe@example.com',
    password: 'securePassword123!',
  });

  useEffect(() => {
    const verifyJWT = async () => {
      try {
        const response = await verify();
        console.log(response);
      } catch (error: any) {
        throw new Error(error);
      }
    };
    verifyJWT();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h3">Login To your Account</Typography>
      <Typography>Welcome back! Please use any of the following methods</Typography>
      <ThirdPartyAuth />
      <Divider>Or Login Using email and password</Divider>
      <Form method="POST">
        <Stack spacing={2}>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            id="email"
            label="email"
            value={creds.email}
            name="email"
            onChange={handleChange}
            type="email"
            error={action?.status === 'fail'}
            helperText={action?.error}
          />

          <PasswordField
            name="password"
            id="password"
            value={creds.password}
            onChange={handleChange}
            label="Enter Your Password"
          />

          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Login
          </Button>
        </Stack>
      </Form>
      <NavLink to="/authentication/sign-up">Register</NavLink>
    </Stack>
  );
};

export const action: ActionFunction = async ({ request }) => {
  const setLoggedIn = useAuthStore.getState().setLoggedIn;
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const response = await login(data);
    console.log(response);
    const user = response.data.user;
    console.log('user', user);
    setLoggedIn(user._id, user.username);
    return redirect(`/`);
  } catch (error: any) {
    return json({ error: error.message, status: 'fail' });
  }
};

export default LoginForm;
