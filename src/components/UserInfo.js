import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Box, Typography, Alert, CircularProgress, Paper, Stack, Divider, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const PROFILE_URL = '/users/profile';

const UserInfo = () => {
  const { auth } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(PROFILE_URL, {
          headers: { Authorization: `Bearer ${auth?.accessToken}` },
        });
        setUserProfile(response.data);
      } catch (err) {
        setErrorMsg('Failed to load user profile');
      }
    };

    fetchUserProfile();
  }, [auth]);

  return (
    <Box sx={{ p: 4, maxWidth: 600, margin: 'auto', bgcolor: '', borderRadius: 2 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 3, color: '#1976d2', textTransform: 'uppercase', letterSpacing: 1 }}>
        Profile Overview
      </Typography>

      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

      {userProfile ? (
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: 'white', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
          <Stack spacing={4} alignItems="center">
            <Avatar sx={{ bgcolor: '#1976d2', width: 80, height: 80 }}>
              <AccountCircleIcon sx={{ fontSize: 60, color: 'white' }} />
            </Avatar>

            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', textTransform: 'capitalize' }}>
              Account Balance
            </Typography>
            <Typography variant="h6" sx={{ fontSize: '1.5rem', fontWeight: 'medium', color: '#1976d2' }}>
              ${userProfile.balance.toFixed(2)}
            </Typography>

            <Divider sx={{ width: '100%', my: 2, bgcolor: '#1976d2' }} />

            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', textTransform: 'capitalize' }}>
              User Roles
            </Typography>
            <Typography variant="h6" sx={{ fontSize: '1.5rem', fontWeight: 'medium', color: '#1976d2' }}>
              {userProfile.roles ? userProfile.roles.join(', ') : 'No roles assigned'}
            </Typography>
          </Stack>
        </Paper>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default UserInfo;
