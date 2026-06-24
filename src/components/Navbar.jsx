import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

import Breadcrumbs from './Breadcrumbs';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { DRAWER_WIDTH } from './Sidebar';

const Navbar = () => {
  const { toggleSidebar, themeMode, toggleTheme } = useUI();
  const { user, logout } = useAuth();
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notiAnchorEl, setNotiAnchorEl] = useState(null);

  const handleOpenProfileMenu = (event) => setProfileAnchorEl(event.currentTarget);
  const handleCloseProfileMenu = () => setProfileAnchorEl(null);

  const handleOpenNotiMenu = (event) => setNotiAnchorEl(event.currentTarget);
  const handleCloseNotiMenu = () => setNotiAnchorEl(null);

  const handleLogout = () => {
    handleCloseProfileMenu();
    logout();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: '100%',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ height: 64, px: { xs: 1.5, sm: 3 } }}>
        {/* Toggle Sidebar Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Dynamic Breadcrumbs */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, pt: 2 }}>
          <Breadcrumbs />
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: 'block', sm: 'none' } }} />

        {/* Toolbar Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Light/Dark Toggle */}
          <Tooltip title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}>
            <IconButton onClick={toggleTheme} color="inherit">
              {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleOpenNotiMenu}>
              <Badge badgeContent={3} color="warning">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notiAnchorEl}
            open={Boolean(notiAnchorEl)}
            onClose={handleCloseNotiMenu}
            PaperProps={{
              sx: { width: 320, mt: 1.5, borderRadius: 2, p: 1 },
            }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Box sx={{ p: 1, pb: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Recent Notifications
              </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <MenuItem onClick={handleCloseNotiMenu} sx={{ py: 1, borderRadius: 1.5 }}>
              <Box>
                <Typography variant="body2" fontWeight={600}>Course sync complete</Typography>
                <Typography variant="caption" color="text.secondary">All 3 active courses loaded in cache.</Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleCloseNotiMenu} sx={{ py: 1, borderRadius: 1.5 }}>
              <Box>
                <Typography variant="body2" fontWeight={600}>User admin session started</Typography>
                <Typography variant="caption" color="text.secondary">Role: Admin. Authenticated at 15:45.</Typography>
              </Box>
            </MenuItem>
          </Menu>

          {/* User Profile */}
          {user && (
            <>
              <Tooltip title="Profile Settings">
                <IconButton onClick={handleOpenProfileMenu} sx={{ p: 0.5 }}>
                  <Avatar alt={user.name} src={user.avatar} sx={{ width: 36, height: 36, border: '2px solid #6C1D5F' }} />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={handleCloseProfileMenu}
                PaperProps={{
                  sx: { width: 220, mt: 1.5, borderRadius: 2, p: 1 },
                }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Box sx={{ p: 1.5, pb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleCloseProfileMenu} sx={{ borderRadius: 1.5 }}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleCloseProfileMenu} sx={{ borderRadius: 1.5 }}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  Account Settings
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={handleLogout} sx={{ borderRadius: 1.5, color: 'error.main' }}>
                  <ListItemIcon sx={{ color: 'error.main' }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
export { DRAWER_WIDTH };
