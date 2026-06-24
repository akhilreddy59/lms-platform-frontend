import { createTheme } from '@mui/material/styles';

const brandingColors = {
  primary: {
    main: '#6C1D5F',       // Tranquil Velvet
    dark: '#4A1E47',       // Tranquil Velvet Dark
    light: '#8F3B82',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#84117C',       // Bright Tr. Velvet
    dark: '#5C0856',
    light: '#AC2FA2',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#01AC9F',       // Emerald
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FF6200',       // CTA Orange
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#D32F2F',       // Standard red
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#0288D1',
    contrastText: '#FFFFFF',
  },
};

export const getTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: brandingColors.primary,
      secondary: brandingColors.secondary,
      success: brandingColors.success,
      warning: brandingColors.warning,
      error: brandingColors.error,
      info: brandingColors.info,
      background: {
        default: isDark ? '#121212' : '#F8F9FA',
        paper: isDark ? '#1E1E1E' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#FFFFFF' : '#1A1A1A',
        secondary: isDark ? '#A0A0A0' : '#606060',
      },
      divider: isDark ? '#2E2E2E' : '#E0E0E0',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 700,
      },
      h2: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 700,
      },
      h3: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 600,
      },
      h4: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 600,
      },
      h5: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 600,
      },
      h6: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 600,
      },
      subtitle1: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 500,
      },
      subtitle2: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 500,
      },
      body1: {
        fontSize: '0.975rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        fontFamily: '"Outfit", sans-serif',
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: isDark
              ? '0px 8px 24px rgba(0, 0, 0, 0.4)'
              : '0px 8px 24px rgba(108, 29, 95, 0.04)',
            border: isDark ? '1px solid #2E2E2E' : '1px solid #F1F1F1',
            borderRadius: 12,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              boxShadow: isDark
                ? '0px 12px 30px rgba(0, 0, 0, 0.5)'
                : '0px 12px 30px rgba(108, 29, 95, 0.08)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            color: isDark ? '#FFFFFF' : '#1A1A1A',
            backgroundImage: 'none',
            boxShadow: 'none',
            borderBottom: isDark ? '1px solid #2E2E2E' : '1px solid #E0E0E0',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
            borderRight: isDark ? '1px solid #2E2E2E' : '1px solid #E0E0E0',
          },
        },
      },
    },
  });
};
