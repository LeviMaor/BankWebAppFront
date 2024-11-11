import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Box, Button, TextField, Typography, Alert, Paper, CircularProgress, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LOGIN_URL = '/auth/login';

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);
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

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setErrorMsg('');
    }

    return () => clearInterval(countdown);
  }, [timer]);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
    passwordRef.current.focus();
  };

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
            disabled={timer > 0 || isLoading}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={timer > 0 || isLoading}
            inputRef={passwordRef}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={timer > 0 || isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
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
