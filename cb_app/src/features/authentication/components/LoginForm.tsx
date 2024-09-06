import { TextField, InputAdornment, IconButton, Stack, Button, Box, Typography, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import useAuthStore from '../userStore';
import { NavLink, useNavigate } from 'react-router-dom';
import ThirdPartyAuth from './ThirdPartyAuth';
import PasswordField from '../../../components/PasswordField';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, verify, isAuthenticated } = useAuthStore((state) => ({
    login: state.login,
    verify: state.verify,
    isAuthenticated: state.isAuthenticated,
  }));
  const [creds, setCreds] = useState<LoginCreds>({
    email: 'johndoe@example.com',
    password: 'securePassword123!',
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      login(creds);
    } catch (error) {}
    console.log('Submitted credentials:', creds);
  };

  useEffect(() => {
    verify();
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated]);

  return (
    <Stack spacing={4}>
      <Typography variant="h3">Login To your Account</Typography>
      <Typography>Welcome back! Please use any of the following methods</Typography>
      <ThirdPartyAuth />
      <Divider>Or Login Using email and password</Divider>
      <form onSubmit={handleSubmit}>
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
      </form>
      <NavLink to="/authentication/sign-up">Register</NavLink>
    </Stack>
  );
};

export default LoginForm;
