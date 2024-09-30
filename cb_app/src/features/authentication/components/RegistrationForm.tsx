import { Button, Stack, Typography, Divider, TextField } from '@mui/material';
import useAuthStore from '../userStore';
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PasswordField from '../../../components/PasswordField';
import ThirdPartyAuth from './ThirdPartyAuth';

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const { signup, verify, isAuthenticated } = useAuthStore((state) => ({
    signup: state.signup,
    verify: state.verify,
    isAuthenticated: state.isAuthenticated,
  }));
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      signup(creds);
      const state = useAuthStore.getState();
      console.log('Store state after Signup:', state);
    } catch (error) {}
    console.log('Submitted credentials:', creds);
  };

  useEffect(() => {
    verify();
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated]);

  return (
    <Stack spacing={2}>
      <Typography variant="h3">Register Your Account</Typography>
      <Typography>Please use any of the following methods</Typography>
      <ThirdPartyAuth />
      <Divider>Or Fill in the following form</Divider>

      <form onSubmit={handleSubmit}>
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
          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Sign Up
          </Button>
        </Stack>
      </form>
      <NavLink to="/authentication/login">Login</NavLink>
    </Stack>
  );
};

export default RegistrationForm;
