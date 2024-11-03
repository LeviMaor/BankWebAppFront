import React from 'react';
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { Container, Box } from '@mui/material';

const Layout = () => {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header />
            <Container component="main" sx={{ flexGrow: 1, mt: 4, mb: 4 }}>
                <Outlet />
            </Container>
            <Footer />
        </Box>
    );
};

export default Layout;