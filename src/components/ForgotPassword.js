import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Paper } from '@mui/material';

const FORGOT_PASSWORD_URL = '/auth/forgot-password';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMsg('');
    setMessage('');

    try {
      await axios.post(FORGOT_PASSWORD_URL, JSON.stringify({ email }), {
        headers: { 'Content-Type': 'application/json' },
      });
      setMessage('A reset code has been sent to your email.');
      navigate('/verify-code', { state: { email } });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send reset code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" mb={3}>
          Forgot Password
        </Typography>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Code'}
          </Button>
        </form>
        <Typography mt={2} align="center">
          Remembered your password? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
