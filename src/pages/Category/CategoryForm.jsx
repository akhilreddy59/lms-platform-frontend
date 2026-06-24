import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Material UI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderIcon from '@mui/icons-material/Folder';

import { useCategories } from '../../hooks/useCategories';

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().min(3, 'Name must be at least 3 characters.').required('Category Name is required.'),
  description: yup.string().max(300, 'Description cannot exceed 300 characters.').optional(),
  status: yup.string().oneOf(['Active', 'Inactive']).required('Status is required.'),
});

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { useDetail, useCreate, useUpdate } = useCategories();
  const createMutation = useCreate();
  const updateMutation = useUpdate(id);

  // Fetch detail if edit mode
  const { data: category, isLoading: isDetailLoading } = useDetail(id);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      status: 'Active',
    },
  });

  // Populate form values when data is loaded (in Edit Mode)
  useEffect(() => {
    if (isEditMode && category) {
      reset({
        name: category.name,
        description: category.description,
        status: category.status,
      });
    }
  }, [category, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate('/category');
    } catch (e) {
      // Errors handled by React Query onError toast triggers
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isEditMode && isDetailLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Upper action row */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/category')}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <FolderIcon color="primary" sx={{ fontSize: 30 }} />
        <Typography variant="h4" fontWeight={700}>
          {isEditMode ? 'Edit Category' : 'Create Category'}
        </Typography>
      </Box>

      {/* Form Card Layout */}
      <Card sx={{ maxWidth: 680 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Category Details
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
            Define name, details, and current visibility status of this category.
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  {...register('name')}
                  label="Category Name"
                  placeholder="e.g. Frontend Development"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  {...register('description')}
                  label="Description"
                  placeholder="Brief summary of topics covered under this category..."
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  {...register('status')}
                  label="Status"
                  fullWidth
                  defaultValue="Active"
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 5 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/category')}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSaving}
                sx={{ minWidth: 120 }}
              >
                {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Details'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CategoryForm;
