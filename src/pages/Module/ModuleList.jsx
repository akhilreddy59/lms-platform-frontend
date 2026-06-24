import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid } from '@mui/x-data-grid';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import { useModules } from '../../hooks/useModules';
import ConfirmDialog from '../../components/ConfirmDialog';

const ModuleList = () => {
  const navigate = useNavigate();
  const { useList, useDelete } = useModules();
  const { data: modules = [], isLoading } = useList();
  const deleteMutation = useDelete();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Deletion modal state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync({ id: deleteId });
    } catch (e) {
      // Handled by react query
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Module Name',
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'courseName',
      headerName: 'Course Mapping',
      flex: 1.2,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'position',
      headerName: 'Order Position',
      flex: 0.8,
      renderCell: (params) => (
        <Typography variant="body2">Position {params.value}</Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit Module">
            <IconButton
              size="small"
              onClick={() => navigate(`/module/edit/${params.row.id}`)}
              sx={{ color: 'primary.main' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Module">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(params.row.id)}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Filtering
  const filteredRows = modules.filter((row) => {
    return (
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (row.description && row.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <Box>
      {/* Header Panel */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ViewModuleIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Modules
            </Typography>
            <Typography variant="body2" color="text.secondary">
              List of courses modules. Order is determined by position within their parent course.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          onClick={() => navigate('/module/add')}
        >
          Add Module
        </Button>
      </Box>

      {/* Main Grid Card */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Filters Row */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search by name, course..."
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

          <Box sx={{ height: 420, width: '100%' }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              loading={isLoading}
              disableSelectionOnClick
              rowHeight={56}
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

      {/* Deletion Dialog */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Module?"
        message="Are you sure you want to delete this module? You must delete all attached submodules first."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleting}
      />
    </Box>
  );
};

export default ModuleList;
