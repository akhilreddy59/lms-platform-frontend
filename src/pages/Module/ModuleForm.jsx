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
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import { useModules } from '../../hooks/useModules';
import { useCourses } from '../../hooks/useCourses';

const schema = yup.object().shape({
  name: yup.string().min(3, 'Module Name must be at least 3 characters.').required('Module Name is required.'),
  courseId: yup.string().required('Course mapping is required.'),
  description: yup.string().max(500, 'Description cannot exceed 500 characters.').optional(),
});

const ModuleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;

  // Retrieve courseId if navigated from course workspace page
  const passedCourseId = location.state?.courseId || '';

  const { useDetail, useCreate, useUpdate } = useModules();
  const { useList: useCoursesList } = useCourses();

  const createMutation = useCreate();
  const updateMutation = useUpdate(id);

  const { data: courses = [], isLoading: isCoursesLoading } = useCoursesList();
  const { data: mod, isLoading: isDetailLoading } = useDetail(id);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      courseId: passedCourseId,
      description: '',
    },
  });

  // Populate Edit Values
  useEffect(() => {
    if (isEditMode && mod) {
      reset({
        name: mod.name,
        courseId: mod.courseId,
        description: mod.description,
      });
    }
  }, [mod, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
      // Navigate back to course view workspace if we had a course context
      const targetCourseId = data.courseId;
      navigate(`/course/view/${targetCourseId}`);
    } catch (e) {
      // Handled by react query
    }
  };

  const isLoading = isCoursesLoading || (isEditMode && isDetailLoading);
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
            if (isEditMode && mod) {
              navigate(`/course/view/${mod.courseId}`);
            } else if (passedCourseId) {
              navigate(`/course/view/${passedCourseId}`);
            } else {
              navigate('/module');
            }
          }}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <ViewModuleIcon color="primary" sx={{ fontSize: 30 }} />
        <Typography variant="h4" fontWeight={700}>
          {isEditMode ? 'Edit Module' : 'Create Module'}
        </Typography>
      </Box>

      {/* Form Content */}
      <Card sx={{ maxWidth: 720 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Module Specifications
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
            Map the module to its parent course and fill out details.
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <TextField
                  {...register('name')}
                  label="Module Name"
                  placeholder="e.g. Module 1: Introduction"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  {...register('courseId')}
                  label="Course Mapping"
                  fullWidth
                  defaultValue=""
                  error={!!errors.courseId}
                  helperText={errors.courseId?.message}
                  disabled={isEditMode || !!passedCourseId} // Prevent changing course of existing module for consistency
                >
                  {courses.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  {...register('description')}
                  label="Description"
                  placeholder="Summary of modules core lessons..."
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
                  if (isEditMode && mod) {
                    navigate(`/course/view/${mod.courseId}`);
                  } else if (passedCourseId) {
                    navigate(`/course/view/${passedCourseId}`);
                  } else {
                    navigate('/module');
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
                {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Module'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ModuleForm;
