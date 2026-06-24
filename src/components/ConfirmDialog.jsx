import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';

const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  severity = 'error', // 'error' or 'warning' or 'info'
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'warning':
        return '#FF6200';
      case 'info':
        return '#0288D1';
      case 'error':
      default:
        return '#D32F2F';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1.5,
          maxWidth: 420,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 1,
            borderRadius: '50%',
            backgroundColor: `${getSeverityColor()}15`,
            color: getSeverityColor(),
          }}
        >
          <WarningAmberIcon />
        </Box>
        {title}
      </DialogTitle>
      <DialogContent sx={{ py: 1 }}>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ gap: 1, pt: 2 }}>
        <Button variant="text" color="inherit" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            backgroundColor: getSeverityColor(),
            '&:hover': {
              backgroundColor: `${getSeverityColor()}dd`,
            },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
