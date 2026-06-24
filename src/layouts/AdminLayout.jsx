import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Navbar from '../components/Navbar';
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { sidebarOpen } = useUI();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Route Guard: Check if authenticated. If loading, show blank placeholder
  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar Drawer */}
      <Sidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          // On desktop, push main content if sidebar is open
          ml: {
            xs: 0,
            md: sidebarOpen ? `${DRAWER_WIDTH}px` : 0,
          },
          // Adjust width to compensate for sidebar
          width: {
            xs: '100%',
            md: sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
          },
        }}
      >
        {/* Toolbar spacer to prevent layout overlap beneath fixed AppBar */}
        <Toolbar sx={{ height: 64 }} />
        
        {/* Dynamic Inner Routes Viewport */}
        <Box sx={{ flexGrow: 1, py: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
