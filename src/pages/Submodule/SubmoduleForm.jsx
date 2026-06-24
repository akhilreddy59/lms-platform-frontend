import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
import SubtitlesIcon from '@mui/icons-material/Subtitles';

import { useSubmodules } from '../../hooks/useSubmodules';
import { useModules } from '../../hooks/useModules';

const schema = yup.object().shape({
  name: yup.string().min(3, 'Submodule Name must be at least 3 characters.').required('Submodule Name is required.'),
  moduleId: yup.string().required('Module mapping is required.'),
  description: yup.string().max(500, 'Description cannot exceed 500 characters.').optional(),
});

const SubmoduleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;

  // Retrieve courseId & moduleId context if navigated from course workspace
  const passedModuleId = location.state?.moduleId || '';
  const passedCourseId = location.state?.courseId || '';

  const { useDetail, useCreate, useUpdate } = useSubmodules();
  const { useList: useModulesList } = useModules();

  const createMutation = useCreate();
  const updateMutation = useUpdate(id);

  const { data: modules = [], isLoading: isModulesLoading } = useModulesList();
  const { data: submod, isLoading: isDetailLoading } = useDetail(id);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      moduleId: passedModuleId,
      description: '',
    },
  });

  // Populate values in Edit Mode
  useEffect(() => {
    if (isEditMode && submod) {
      reset({
        name: submod.name,
        moduleId: submod.moduleId,
        description: submod.description,
      });
    }
  }, [submod, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      
      // Navigate back to course view workspace if we had a course context
      if (passedCourseId) {
        navigate(`/course/view/${passedCourseId}`);
      } else {
        navigate('/submodule');
      }
    } catch (e) {
      // Handled by react query
    }
  };

  const isLoading = isModulesLoading || (isEditMode && isDetailLoading);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header bar */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            if (passedCourseId) {
              navigate(`/course/view/${passedCourseId}`);
            } else {
              navigate('/submodule');
            }
          }}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <SubtitlesIcon color="primary" sx={{ fontSize: 30 }} />
        <Typography variant="h4" fontWeight={700}>
          {isEditMode ? 'Edit Submodule' : 'Create Submodule'}
        </Typography>
      </Box>

      {/* Form Card Layout */}
      <Card sx={{ maxWidth: 720 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Submodule Specifications
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
            Associate this submodule to its parent module container.
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <TextField
                  {...register('name')}
                  label="Submodule Name"
                  placeholder="e.g. Submodule 1.1: Core Concepts"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  {...register('moduleId')}
                  label="Module Mapping"
                  fullWidth
                  defaultValue=""
                  error={!!errors.moduleId}
                  helperText={errors.moduleId?.message}
                  disabled={isEditMode || !!passedModuleId} // Keep module structural mapping fixed on edit
                >
                  {modules.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.name} ({m.courseName})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  {...register('description')}
                  label="Description"
                  placeholder="Summary of submodules lessons..."
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 5 }}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  if (passedCourseId) {
                    navigate(`/course/view/${passedCourseId}`);
                  } else {
                    navigate('/submodule');
                  }
                }}
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
                {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Submodule'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SubmoduleForm;
