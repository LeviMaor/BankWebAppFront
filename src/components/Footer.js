import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#1976d2',
                color: 'white',
                padding: '16px',
                textAlign: 'center',
                marginTop: 'auto',
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: 300 }}>
                © {new Date().getFullYear()} Levi Maor. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;