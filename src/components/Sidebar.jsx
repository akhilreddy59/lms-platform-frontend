import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import XebiaLogo from './XebiaLogo';
import { useUI } from '../context/UIContext';

const DRAWER_WIDTH = 260;

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useUI();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Collapsed lists state
  const [openMenus, setOpenMenus] = useState({
    category: false,
    course: false,
    module: false,
    submodule: false,
    content: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    {
      text: 'Category',
      icon: <FolderIcon />,
      key: 'category',
      children: [
        { text: 'View Categories', path: '/category' },
        { text: 'Add Category', path: '/category/add' },
      ],
    },
    {
      text: 'Course',
      icon: <MenuBookIcon />,
      key: 'course',
      children: [
        { text: 'View Courses', path: '/course' },
        { text: 'Add Course', path: '/course/add' },
      ],
    },
    {
      text: 'Module',
      icon: <ViewModuleIcon />,
      key: 'module',
      children: [
        { text: 'View Modules', path: '/module' },
        { text: 'Add Module', path: '/module/add' },
      ],
    },
    {
      text: 'Submodule',
      icon: <SubtitlesIcon />,
      key: 'submodule',
      children: [
        { text: 'View Submodules', path: '/submodule' },
        { text: 'Add Submodule', path: '/submodule/add' },
      ],
    },
    {
      text: 'Content',
      icon: <DescriptionIcon />,
      key: 'content',
      children: [
        { text: 'View Content', path: '/content' },
        { text: 'Add Content', path: '/content/add' },
      ],
    },
  ];

  const secondaryItems = [
    { text: 'Users (UI)', icon: <PeopleIcon />, path: '/users' },
    { text: 'Roles & Permissions', icon: <SecurityIcon />, path: '/roles' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isTablet) {
      setSidebarOpen(false); // Auto close sidebar on mobile/tablet click
    }
  };

  const renderDrawerContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header / Brand Logo */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 64,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <XebiaLogo width={130} height={32} />
        </Link>
      </Box>

      {/* Menu List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2, px: 1.5 }}>
        <List component="nav" disablePadding>
          {menuItems.map((item) => {
            if (item.children) {
              const isSectionOpen = openMenus[item.key] || isActive(item.children[0].path) || isActive(item.children[1].path);
              const hasActiveChild = item.children.some((child) => isActive(child.path));

              return (
                <Box key={item.text} sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => toggleMenu(item.key)}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      color: hasActiveChild ? 'primary.main' : 'text.primary',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: hasActiveChild ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: hasActiveChild ? 600 : 500 }}
                    />
                    {isSectionOpen ? <ExpandLess size={18} /> : <ExpandMore size={18} />}
                  </ListItemButton>

                  <Collapse in={isSectionOpen || openMenus[item.key]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 4, mt: 0.5 }}>
                      {item.children.map((child) => {
                        const childActive = isActive(child.path);
                        return (
                          <ListItemButton
                            key={child.text}
                            onClick={() => handleNavigation(child.path)}
                            sx={{
                              borderRadius: 1.5,
                              py: 0.75,
                              mb: 0.5,
                              color: childActive ? 'primary.main' : 'text.secondary',
                              backgroundColor: childActive ? 'rgba(108, 29, 95, 0.08)' : 'transparent',
                              '&:hover': {
                                backgroundColor: childActive ? 'rgba(108, 29, 95, 0.12)' : 'action.hover',
                              },
                            }}
                          >
                            <ListItemText
                              primary={child.text}
                              primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: childActive ? 600 : 500 }}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                </Box>
              );
            }

            const active = isActive(item.path);

            return (
              <ListItemButton
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  mb: 0.5,
                  color: active ? 'primary.main' : 'text.primary',
                  backgroundColor: active ? 'rgba(108, 29, 95, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: active ? 'rgba(108, 29, 95, 0.12)' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: active ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: active ? 600 : 500 }}
                />
              </ListItemButton>
            );
          })}

          <Box sx={{ py: 1 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="caption" sx={{ px: 2, py: 1, display: 'block', color: 'text.secondary', fontWeight: 600 }}>
              Management
            </Typography>
          </Box>

          {secondaryItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItemButton
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  mb: 0.5,
                  color: active ? 'primary.main' : 'text.primary',
                  backgroundColor: active ? 'rgba(108, 29, 95, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: active ? 'rgba(108, 29, 95, 0.12)' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: active ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: active ? 600 : 500 }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Footer / User Profile Summary */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.default',
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
          Xebia LMS v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: DRAWER_WIDTH },
        flexShrink: { md: 0 },
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isTablet ? sidebarOpen : false}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
      >
        {renderDrawerContent()}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="persistent"
        open={isTablet ? false : sidebarOpen}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
      >
        {renderDrawerContent()}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
export { DRAWER_WIDTH };
