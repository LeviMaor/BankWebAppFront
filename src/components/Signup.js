import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Checkbox, FormControlLabel, Paper } from '@mui/material';

const SIGNUP_URL = '/auth/signup';
const SIGNUP_ADMIN_URL = '/auth/signup-admin';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('Invalid email format');
      return;
    }
    if (password !== verifyPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    const signupData = {
      email,
      password,
      ...(isAdmin && { key: adminKey }),
    };

    const signupUrl = isAdmin ? SIGNUP_ADMIN_URL : SIGNUP_URL;

    try {
      await axios.post(signupUrl, JSON.stringify(signupData), {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Signup successful');
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.response.data.message || 'Signup failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" mb={3}>Sign Up</Typography>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Verify Password"
            type="password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <FormControlLabel
            control={<Checkbox checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />}
            label="Signup as Admin"
          />
          {isAdmin && (
            <TextField
              label="Admin Secret Key"
              type="text"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </form>
        <Typography mt={2} align="center">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;