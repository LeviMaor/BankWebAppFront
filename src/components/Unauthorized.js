import React, { useContext} from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  console.log("Unauthorized")
  const handleGoHome = () => {
    sessionStorage.setItem('isAuthenticated', 'false');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
        Unauthorized Access
      </Typography>
      <Typography variant="h6" component="p" sx={{ mb: 4 }}>
        You do not have permission to view this page.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoHome}>
        Go to Home
      </Button>
    </Box>
  );
};

export default Unauthorized;