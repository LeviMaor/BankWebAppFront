import React, { useState, useContext } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

const NEW_TRANSACTION_URL = '/transactions/new';

const NewTransaction = () => {
  const { auth } = useContext(AuthContext);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(NEW_TRANSACTION_URL,
        JSON.stringify({ recipientEmail, amount }),
        { headers: { Authorization: `Bearer ${auth?.accessToken}`, 'Content-Type': 'application/json' } }
      );
      navigate('/user/transactions');
    } catch (err) {
      if (err.response) {
        setErrorMsg(err.response.data.message || 'Failed to create transaction');
      } else {
        setErrorMsg('Failed to create transaction');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" mb={2}>New Transaction</Typography>
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Recipient Email"
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          fullWidth
          required
          margin="normal"
          inputProps={{ min: 0.01, step: 0.01 }} // Enforce positive values only
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default NewTransaction;
