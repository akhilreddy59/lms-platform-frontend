import React, { useEffect, useState } from 'react';
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
import DescriptionIcon from '@mui/icons-material/Description';

// Hooks & Components
import { useContents } from '../../hooks/useContents';
import { useCourses } from '../../hooks/useCourses';
import { useModules } from '../../hooks/useModules';
import { useSubmodules } from '../../hooks/useSubmodules';
import FileUpload from '../../components/FileUpload';

const schema = yup.object().shape({
  name: yup.string().min(3, 'Content Name must be at least 3 characters.').required('Content Name is required.'),
  contentType: yup.string().oneOf(['Notes', 'PDF', 'PPT', 'Comparison Table', 'Video']).required('Format type is required.'),
  courseId: yup.string().required('Course mapping is required.'),
  moduleId: yup.string().required('Module mapping is required.'),
  submoduleId: yup.string().required('Submodule mapping is required.'),
  description: yup.string().max(500, 'Description cannot exceed 500 characters.').optional(),
  status: yup.string().oneOf(['Active', 'Draft', 'Pending', 'Reviewed', 'Inactive', 'Failed']).required('Status is required.'),
});

const ContentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;

  // Retrieve route context parameters if navigated from Course curriculum workspace
  const passedCourseId = location.state?.courseId || '';
  const passedModuleId = location.state?.moduleId || '';
  const passedSubmoduleId = location.state?.submoduleId || '';

  const { useDetail, useCreate, useUpdate } = useContents();
  const { useList: useCoursesList } = useCourses();
  const { useList: useModulesList } = useModules();
  const { useList: useSubmodulesList } = useSubmodules();

  const createMutation = useCreate();
  const updateMutation = useUpdate(id);

  // Queries
  const { data: courses = [], isLoading: isCoursesLoading } = useCoursesList();
  const { data: modules = [], isLoading: isModulesLoading } = useModulesList();
  const { data: submodules = [], isLoading: isSubmodulesLoading } = useSubmodulesList();
  const { data: content, isLoading: isDetailLoading } = useDetail(id);

  // Local state for file details
  const [uploadedFile, setUploadedFile] = useState(null);

  // Form setup
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      contentType: 'PDF',
      courseId: passedCourseId,
      moduleId: passedModuleId,
      submoduleId: passedSubmoduleId,
      description: '',
      status: 'Active',
    },
  });

  // Watch fields for cascading dropdown filters
  const watchedCourseId = watch('courseId');
  const watchedModuleId = watch('moduleId');

  // Filter modules based on selected course
  const filteredModules = modules.filter((m) => m.courseId === watchedCourseId);
  // Filter submodules based on selected module
  const filteredSubmodules = submodules.filter((s) => s.moduleId === watchedModuleId);

  // Populate Edit Mode values
  useEffect(() => {
    if (isEditMode && content) {
      reset({
        name: content.name,
        contentType: content.contentType,
        courseId: content.courseId,
        moduleId: content.moduleId,
        submoduleId: content.submoduleId,
        description: content.description,
        status: content.status,
      });
      if (content.fileName) {
        setUploadedFile({
          fileName: content.fileName,
          fileSize: content.fileSize,
          fileUrl: content.fileUrl,
        });
      }
    }
  }, [content, isEditMode, reset]);

  // Adjust cascading select states if user modifies parent choice
  useEffect(() => {
    // If courseId changes and module isn't in filtered list, reset it
    if (watchedCourseId && !isDetailLoading && !isEditMode) {
      const match = filteredModules.some((m) => m.id === watchedModuleId);
      if (!match) {
        setValue('moduleId', '');
        setValue('submoduleId', '');
      }
    }
  }, [watchedCourseId, filteredModules, watchedModuleId, setValue]);

  useEffect(() => {
    if (watchedModuleId && !isDetailLoading && !isEditMode) {
      const match = filteredSubmodules.some((s) => s.id === watch('submoduleId'));
      if (!match) {
        setValue('submoduleId', '');
      }
    }
  }, [watchedModuleId, filteredSubmodules, setValue]);

  const handleFileUploadComplete = (file) => {
    setUploadedFile(file);
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      fileName: uploadedFile?.fileName || '',
      fileSize: uploadedFile?.fileSize || '',
      fileUrl: uploadedFile?.fileUrl || '#',
    };

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }
      
      if (passedCourseId || payload.courseId) {
        navigate(`/course/view/${passedCourseId || payload.courseId}`);
      } else {
        navigate('/content');
      }
    } catch (e) {
      // Handled by react query
    }
  };

  const isLoading =
    isCoursesLoading ||
    isModulesLoading ||
    isSubmodulesLoading ||
    (isEditMode && isDetailLoading);

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
            } else if (isEditMode && content) {
              navigate(`/course/view/${content.courseId}`);
            } else {
              navigate('/content');
            }
          }}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <DescriptionIcon color="primary" sx={{ fontSize: 30 }} />
        <Typography variant="h4" fontWeight={700}>
          {isEditMode ? 'Edit Content' : 'Create Content'}
        </Typography>
      </Box>

      {/* Form Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Content details
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
                Configure name, description, format types, and relational positions.
              </Typography>
              <Divider sx={{ mb: 4 }} />

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      {...register('name')}
                      label="Content Name"
                      placeholder="e.g. Introduction Lecture Slides"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      select
                      {...register('contentType')}
                      label="Format Type"
                      fullWidth
                      defaultValue="PDF"
                      error={!!errors.contentType}
                      helperText={errors.contentType?.message}
                    >
                      <MenuItem value="Notes">Notes</MenuItem>
                      <MenuItem value="PDF">PDF</MenuItem>
                      <MenuItem value="PPT">PPT</MenuItem>
                      <MenuItem value="Comparison Table">Comparison Table</MenuItem>
                      <MenuItem value="Video">Video</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Relational Cascading Selects */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      select
                      {...register('courseId')}
                      label="Course Mapping"
                      fullWidth
                      defaultValue=""
                      error={!!errors.courseId}
                      helperText={errors.courseId?.message}
                      disabled={isEditMode || !!passedCourseId}
                    >
                      {courses.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      select
                      {...register('moduleId')}
                      label="Module Mapping"
                      fullWidth
                      value={watch('moduleId') || ''}
                      error={!!errors.moduleId}
                      helperText={errors.moduleId?.message}
                      disabled={isEditMode || !watchedCourseId || !!passedModuleId}
                    >
                      {filteredModules.map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                          {m.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      select
                      {...register('submoduleId')}
                      label="Submodule Mapping"
                      fullWidth
                      value={watch('submoduleId') || ''}
                      error={!!errors.submoduleId}
                      helperText={errors.submoduleId?.message}
                      disabled={isEditMode || !watchedModuleId || !!passedSubmoduleId}
                    >
                      {filteredSubmodules.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </TextField>
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
                      <MenuItem value="Draft">Draft</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Reviewed">Reviewed</MenuItem>
                      <MenuItem value="Inactive">Inactive</MenuItem>
                      <MenuItem value="Failed">Failed</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      {...register('description')}
                      label="Description"
                      placeholder="Brief outline detailing learning objectives covered by this file..."
                      fullWidth
                      multiline
                      rows={3}
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
                        navigate('/content');
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
                    {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Content'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* File attachment box on right */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Upload File Attachment
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <FileUpload onUploadComplete={handleFileUploadComplete} multiple={false} />

              {uploadedFile && (
                <Box sx={{ mt: 3, p: 2, borderRadius: 1.5, backgroundColor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" fontWeight={600} noWrap>{uploadedFile.fileName}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">{uploadedFile.fileSize}</Typography>
                  {uploadedFile.fileUrl !== '#' && (
                    <Typography variant="caption" color="success.main" fontWeight={600} display="block" sx={{ mt: 1 }}>
                      ✓ File mapping linked!
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContentForm;
