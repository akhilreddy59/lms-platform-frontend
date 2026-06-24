import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import MUIBreadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';

const routeMap = {
  '': 'Home',
  dashboard: 'Dashboard',
  category: 'Categories',
  add: 'Add New',
  edit: 'Edit',
  course: 'Courses',
  module: 'Modules',
  submodule: 'Submodules',
  content: 'Content',
  users: 'Users',
  roles: 'Roles & Permissions',
  settings: 'Settings',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on login or forgot password pages
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/forgot-password') {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <MUIBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.secondary', opacity: 0.7 }} />}
        aria-label="breadcrumb"
      >
        <Link
          component={RouterLink}
          to="/dashboard"
          underline="hover"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem' }}
        >
          <HomeIcon fontSize="inherit" />
          Home
        </Link>
        
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Check if value is an ID (contains numeric suffix or random characters like course-1 or submod-2 etc)
          const isId = value.includes('-') && !['add', 'edit', 'roles-permissions'].includes(value);
          const label = isId ? 'Details' : (routeMap[value] || value.charAt(0).toUpperCase() + value.slice(1));

          return last ? (
            <Typography key={to} color="text.primary" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {label}
            </Typography>
          ) : (
            <Link
              key={to}
              component={RouterLink}
              to={to}
              underline="hover"
              color="inherit"
              sx={{ fontSize: '0.875rem' }}
            >
              {label}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
