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
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid } from '@mui/x-data-grid';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';

import { useCategories } from '../../hooks/useCategories';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';

const CategoryList = () => {
  const navigate = useNavigate();
  const { useList, useDelete } = useCategories();
  const { data: categories = [], isLoading } = useList();
  const deleteMutation = useDelete();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
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
      await deleteMutation.mutateAsync(deleteId);
    } catch (e) {
      // Toast handles error automatically via React Query hook
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Category Name', flex: 1.5, renderCell: (params) => (
      <Typography variant="body2" fontWeight={600} color="text.primary">
        {params.value}
      </Typography>
    )},
    { field: 'description', headerName: 'Description', flex: 2 },
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
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit Category">
            <IconButton
              size="small"
              onClick={() => navigate(`/category/edit/${params.row.id}`)}
              sx={{ color: 'primary.main' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Category">
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
  const filteredRows = categories.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          row.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box>
      {/* Header Panel */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FolderIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Categories
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure LMS groupings. Courses are mapped directly inside categories.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          onClick={() => navigate('/category/add')}
        >
          Add Category
        </Button>
      </Box>

      {/* Main Grid View */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Filters Row */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ maxWidth: 320, width: '100%' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
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

      {/* Confirmation Modal */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Category?"
        message="Are you sure you want to delete this category? All courses in it must be cleared or reassigned first."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleting}
      />
    </Box>
  );
};

export default CategoryList;
