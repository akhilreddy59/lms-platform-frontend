import React from 'react';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import ScheduleIcon from '@mui/icons-material/Schedule';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNoteIcon from '@mui/icons-material/EditNote';
import BlockIcon from '@mui/icons-material/Block';
import ErrorIcon from '@mui/icons-material/Error';
import DeleteIcon from '@mui/icons-material/Delete';

const statusConfig = {
  SUCCESS: { color: 'success', icon: CheckCircleIcon, label: 'Success' },
  ACTIVE: { color: 'success', icon: VerifiedIcon, label: 'Active' },
  PENDING: { color: 'warning', icon: ScheduleIcon, label: 'Pending' },
  REVIEWED: { color: 'warning', icon: VisibilityIcon, label: 'Reviewed' },
  DRAFT: { color: 'default', icon: EditNoteIcon, label: 'Draft' },
  INACTIVE: { color: 'default', icon: BlockIcon, label: 'Inactive' },
  FAILED: { color: 'error', icon: ErrorIcon, label: 'Failed' },
  DELETED: { color: 'error', icon: DeleteIcon, label: 'Deleted' },
};

const StatusBadge = ({ status }) => {
  if (!status) return null;
  
  const key = status.toUpperCase();
  const config = statusConfig[key] || { color: 'default', icon: VerifiedIcon, label: status };
  const IconComponent = config.icon;

  return (
    <Chip
      icon={<IconComponent style={{ fontSize: '1rem' }} />}
      label={config.label}
      color={config.color === 'default' ? 'default' : config.color}
      size="small"
      variant="outlined"
      sx={{
        borderRadius: '6px',
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        borderWidth: '1.5px',
        py: 0.5,
        '& .MuiChip-label': {
          px: 1,
        },
        '& .MuiChip-icon': {
          ml: 0.5,
          color: 'inherit',
        },
        // Custom branding coloring overrides
        ...(config.color === 'success' && {
          color: '#01AC9F',
          borderColor: '#01AC9F',
          backgroundColor: 'rgba(1, 172, 159, 0.08)',
        }),
        ...(config.color === 'warning' && {
          color: '#FF6200',
          borderColor: '#FF6200',
          backgroundColor: 'rgba(255, 98, 0, 0.08)',
        }),
      }}
    />
  );
};

export default StatusBadge;
