import React, { useContext } from 'react';
import { Box, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from '../api/axios';

const UserNavbar = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await axios.post('/auth/logout');
        setAuth({});
        document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        navigate('/login');
    };

    return (
        <Box sx={{
            display: { xs: 'block', sm: 'flex' },
            gap: 2,
            mb: 2
        }}>
            <Button
                component={Link}
                to="/user/info"
                variant="outlined"
                sx={{
                    '&:hover': {
                        backgroundColor: 'blue',
                        color: 'white',
                    },
                    width: { xs: '100%', sm: 'auto' } // full width on mobile
                }}
            >
                User Info
            </Button>
            <Button
                component={Link}
                to="/user/transactions"
                variant="outlined"
                sx={{
                    '&:hover': {
                        backgroundColor: 'blue',
                        color: 'white',
                    },
                    width: { xs: '100%', sm: 'auto' }
                }}
            >
                Transactions
            </Button>
            <Button
                component={Link}
                to="/user/newtransaction"
                variant="outlined"
                sx={{
                    '&:hover': {
                        backgroundColor: 'blue',
                        color: 'white',
                    },
                    width: { xs: '100%', sm: 'auto' }
                }}
            >
                New Transaction
            </Button>
            <Button
                onClick={handleLogout}
                variant="outlined"
                sx={{
                    '&:hover': {
                        backgroundColor: 'blue',
                        color: 'white',
                    },
                    width: { xs: '100%', sm: 'auto' }
                }}
            >
                Logout
            </Button>
        </Box>
    );
};

export default UserNavbar;