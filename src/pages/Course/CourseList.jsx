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
import Avatar from '@mui/material/Avatar';
import { DataGrid } from '@mui/x-data-grid';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import { useCourses } from '../../hooks/useCourses';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';

const CourseList = () => {
  const navigate = useNavigate();
  const { useList, useDelete } = useCourses();
  const { data: courses = [], isLoading } = useList();
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
      // Handled by react query error toast
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      field: 'thumbnail',
      headerName: 'Preview',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Avatar
            variant="rounded"
            src={params.value}
            sx={{ width: 44, height: 44, border: '1px solid', borderColor: 'divider' }}
          />
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: 'Course Name',
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'categoryName',
      headerName: 'Category',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
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
      flex: 1.2,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Curriculum & Structure">
            <IconButton
              size="small"
              onClick={() => navigate(`/course/view/${params.row.id}`)}
              sx={{ color: 'info.main' }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Course Details">
            <IconButton
              size="small"
              onClick={() => navigate(`/course/edit/${params.row.id}`)}
              sx={{ color: 'primary.main' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Course">
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
  const filteredRows = courses.filter((row) => {
    const matchesSearch =
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box>
      {/* Header Panel */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <MenuBookIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Courses
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage LMS training courses. Select View to access syllabus structure reordering.
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          onClick={() => navigate('/course/add')}
        >
          Add Course
        </Button>
      </Box>

      {/* Main Grid Card */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          {/* Filters Row */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search by name, category, description..."
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

      {/* Deletion Dialog */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Course?"
        message="Are you sure you want to delete this course? You must clear out any modules or content files mapped to it first."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={isDeleting}
      />
    </Box>
  );
};

export default CourseList;
