import { Button, Stack, Typography, Divider, TextField } from '@mui/material';
import useAuthStore from '../userStore';
import { useState, useEffect } from 'react';
import { ActionFunction, Form, json, NavLink, redirect, useActionData } from 'react-router-dom';
import PasswordField from '../../../components/PasswordField';
import ThirdPartyAuth from './ThirdPartyAuth';
import { signup } from '../services';

const RegistrationForm: React.FC = () => {
  const action = useActionData() as { [key: string]: any };
  const [creds, setCreds] = useState<SignupCreds>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  }

  useEffect(() => {}, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h3">Register Your Account</Typography>
      <Typography>Please use any of the following methods</Typography>
      <ThirdPartyAuth />
      <Divider>Or Fill in the following form</Divider>

      {/* <form onSubmit={handleSubmit}> */}
      <Form method="POST">
        <Stack spacing={2}>
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            id="firstName"
            label="First Name"
            value={creds.firstName}
            name="firstName"
            onChange={handleChange}
            type="text"
          />
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            id="lastName"
            label="Last Name"
            value={creds.lastName}
            name="lastName"
            onChange={handleChange}
            type="text"
          />
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            id="username"
            label="Username"
            value={creds.username}
            name="username"
            onChange={handleChange}
            type="text"
          />
          <TextField
            variant="outlined"
            fullWidth
            size="small"
            id="email"
            label="Email"
            value={creds.email}
            name="email"
            onChange={handleChange}
            type="email"
          />
          <PasswordField
            name="password"
            id="password"
            value={creds.password}
            onChange={handleChange}
            label="Password"
          />
          <PasswordField
            name="passwordConfirm"
            id="passwordConfirm"
            value={creds.passwordConfirm}
            onChange={handleChange}
            label="Confirm Your Password"
          />
          {action?.status === 'fail' ? <p>{action.error}</p> : <></>}
          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Sign Up
          </Button>
        </Stack>
      </Form>
      <NavLink to="/authentication/login">Login</NavLink>
    </Stack>
  );
};

export const action: ActionFunction = async ({ request }) => {
  const setLoggedIn = useAuthStore.getState().setLoggedIn;
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    const response = await signup(data);
    console.log(response);
    const user = response.data.user;
    console.log('user', user);
    setLoggedIn(user._id, user.username);
    return redirect(`/`);
  } catch (error: any) {
    return json({ error: error.message, status: 'fail' });
  }
};

export default RegistrationForm;
