import React, { useState, useContext, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Box, Button, TextField, Typography, Alert, Paper } from '@mui/material';

const LOGIN_URL = '/auth/login';

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [timer, setTimer] = useState(0); // New state for timer
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrorMsg('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    try {
      const response = await axios.post(LOGIN_URL, JSON.stringify({ email, password }), {
        headers: { 'Content-Type': 'application/json' }
      });
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ email, roles, accessToken });
      document.cookie = `token=${accessToken}; path=/`;
      if (roles.includes('admin')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/info');
      }
    } catch (err) {
      if (!err?.response) {
        setErrorMsg('No Server Response');
      } else if (err.response?.status === 401) {
        setErrorMsg('Unauthorized');
      } else if (err.response?.status === 429) {
        setTimer(60);
      } else {
        setErrorMsg('Login Failed');
      }
    }
  };

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setErrorMsg(''); // Clear the error message once the timer reaches 0
    }

    return () => clearInterval(countdown); // Cleanup interval on component unmount
  }, [timer]);

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" mb={3}>Login</Typography>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {timer > 0 ? `${errorMsg} Please try again in ${timer} seconds.` : errorMsg}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={timer > 0} // Disable input when timer is active
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={timer > 0} // Disable input when timer is active
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={timer > 0}>
            Login
          </Button>
        </form>
        <Typography mt={2} align="center">
          <Link to="/forgot-password">Forgot Password?</Link>
        </Typography>
        <Typography mt={2} align="center">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
