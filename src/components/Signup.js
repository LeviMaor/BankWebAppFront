import React, { useState, useRef } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Paper, CircularProgress, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const SIGNUP_URL = '/auth/signup';
const VERIFY_EMAIL_URL = '/auth/verify-email';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const passwordRef = useRef(null);
  const verifyPasswordRef = useRef(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    if (password !== verifyPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(SIGNUP_URL, JSON.stringify({ email, password }), {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Signup successful. Please check your email for the verification code.');
      setIsVerifying(true);
    } catch (err) {
      setErrorMsg(err.response.data.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(VERIFY_EMAIL_URL, JSON.stringify({ email, code: verificationCode }), {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Email verified successfully! Redirecting to login...');
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.response.data.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
    passwordRef.current.focus();
  };

  const toggleVerifyPasswordVisibility = () => {
    setShowVerifyPassword((prev) => !prev);
    verifyPasswordRef.current.focus();
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" mb={3}>
          Sign Up
        </Typography>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        {!isVerifying ? (
          <form onSubmit={handleSignup}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
              disabled={isLoading}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              disabled={isLoading}
              inputRef={passwordRef}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="Verify Password"
              type={showVerifyPassword ? 'text' : 'password'}
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              disabled={isLoading}
              inputRef={verifyPasswordRef}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={toggleVerifyPasswordVisibility} edge="end">
                    {showVerifyPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyEmail}>
            <TextField
              label="Verification Code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              fullWidth
              required
              margin="normal"
              disabled={isLoading}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify Email'}
            </Button>
          </form>
        )}
        <Typography mt={2} align="center">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;
