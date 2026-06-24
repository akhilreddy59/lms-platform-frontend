import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { DataGrid } from '@mui/x-data-grid';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';

import StatusBadge from '../components/StatusBadge';

const mockUsers = [
  { id: 1, name: 'Xebia Administrator', email: 'admin@xebia.com', role: 'Admin', status: 'Active', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80' },
  { id: 2, name: 'John Doe', email: 'john.doe@xebia.com', role: 'Manager', status: 'Active', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80' },
  { id: 3, name: 'Sarah Smith', email: 'sarah.smith@xebia.com', role: 'Trainer', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80' },
  { id: 4, name: 'Alex Johnson', email: 'alex.j@xebia.com', role: 'Organizer', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80' },
  { id: 5, name: 'Michael Brown', email: 'michael.b@xebia.com', role: 'Student', status: 'Inactive', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=80&h=80' },
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const columns = [
    {
      field: 'name',
      headerName: 'User Details',
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
          <Avatar src={params.row.avatar} alt={params.row.name} sx={{ width: 34, height: 34 }} />
          <Box>
            <Typography variant="body2" fontWeight={600}>{params.row.name}</Typography>
            <Typography variant="caption" color="text.secondary">{params.row.email}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>{params.value}</Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => <StatusBadge status={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: () => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" startIcon={<EditIcon />} variant="outlined">
            Edit
          </Button>
          <Button size="small" startIcon={<DeleteIcon />} color="error" variant="outlined">
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PeopleIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Users Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and configure roles for users registered on the LMS platform.
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} color="primary">
          Invite User
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Filters Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search users by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ maxWidth: 360, width: '100%' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Users Table */}
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              rowHeight={60}
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Users;
