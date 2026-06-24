import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Icons
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import XebiaLogo from '../components/XebiaLogo';
import { useUI } from '../context/UIContext';
import { delay } from '../services/api';

const schema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address.').required('Email is required.'),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useUI();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await delay(1000); // Simulate network
      setSubmitted(true);
      showToast(`Recovery link sent to ${data.email}!`, 'success');
    } catch (err) {
      showToast('An error occurred. Please try again.', 'error');
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
            {!submitted ? (
              <>
                <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
                  Reset Password
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Enter your email address and we'll send you a link to reset your password.
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

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 700,
                      backgroundColor: '#6C1D5F',
                      '&:hover': {
                        backgroundColor: '#4A1E47',
                      },
                    }}
                  >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Send Recovery Link'}
                  </Button>
                </form>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom color="primary">
                  Check Your Email
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  We have sent a password reset link to your email address. Please follow the instructions in the email.
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setSubmitted(false)}
                  sx={{ mb: 2 }}
                >
                  Resend Email
                </Button>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Link
                href="/login"
                variant="body2"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', fontWeight: 600 }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
              >
                <ArrowBackIcon fontSize="inherit" />
                Back to Login
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
