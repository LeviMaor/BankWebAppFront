import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const handleGoHome = () => {
        if (!auth || !auth.accessToken) {
            navigate('/login');
        } else {
            const isAdmin = auth.roles?.includes('admin');
            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/info');
            }
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleGoHome}>
                    <IconButton edge="start" color="inherit" aria-label="logo" sx={{ mr: 1 }}>
                        <AccountBalanceIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
                        Web Banking App
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;