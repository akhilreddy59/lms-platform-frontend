import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Material UI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

// Icons
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import XebiaLogo from '../components/XebiaLogo';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

// Validation Schema
const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address.').required('Email is required.'),
  password: yup.string().min(6, 'Password must be at least 6 characters.').required('Password is required.'),
});

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      showToast('Welcome to Xebia LMS Admin Portal!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, #1e1e1e 0%, #121212 100%)'
            : 'radial-gradient(circle, #fcfafc 0%, #f4eef3 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ mb: 2 }}>
            <XebiaLogo width={220} height={50} />
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            Enterprise Learning Management System Admin Portal
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 4, border: 'none', boxShadow: '0px 10px 30px rgba(108, 29, 95, 0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" align="center" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
              Sign In
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                {...register('email')}
                label="Email Address"
                placeholder="admin@xebia.com"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                {...register('password')}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5, mb: 3 }}>
                <Link
                  href="/forgot-password"
                  variant="body2"
                  color="secondary.main"
                  sx={{ textDecoration: 'none', fontWeight: 600 }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/forgot-password');
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  backgroundColor: '#6C1D5F',
                  '&:hover': {
                    backgroundColor: '#4A1E47',
                  },
                }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials Alert Helper */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block">
            <strong>Demo Credentials:</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            Email: <code>admin@xebia.com</code> | Password: <code>admin123</code>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
