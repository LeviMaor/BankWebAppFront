import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Box, Typography, Alert, CircularProgress, Paper, Stack, Divider } from '@mui/material';

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
    <Box sx={{ p: 4, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" mb={3} align="center" sx={{ fontWeight: 'bold' }}>
        Your Profile
      </Typography>

      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

      {userProfile ? (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Account Balance
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary' }}>
              ${userProfile.balance.toFixed(2)}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              User Roles
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'text.secondary' }}>
              {userProfile.roles ? userProfile.roles.join(', ') : 'No roles assigned'}
            </Typography>
          </Stack>
        </Paper>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default UserInfo;