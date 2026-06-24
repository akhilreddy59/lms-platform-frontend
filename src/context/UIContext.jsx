import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getTheme } from '../theme/theme';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'light';
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  const activeTheme = getTheme(themeMode);

  return (
    <UIContext.Provider
      value={{
        themeMode,
        toggleTheme,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        showToast,
      }}
    >
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        {children}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }} variant="filled">
            {toast.message}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
