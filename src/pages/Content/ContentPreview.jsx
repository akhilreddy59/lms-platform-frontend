import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

import { useContents } from '../../hooks/useContents';
import StatusBadge from '../../components/StatusBadge';

const ContentPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useDetail } = useContents();
  const { data: content, isLoading } = useDetail(id);

  // States for PDF/PPT mock views
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!content) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error">Content item not found.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/content')} sx={{ mt: 2 }}>
          Back to list
        </Button>
      </Box>
    );
  }

  const renderPreviewType = () => {
    switch (content.contentType) {
      case 'Video':
        return (
          <Box sx={{ position: 'relative', pt: '56.25%', width: '100%', backgroundColor: '#000000', borderRadius: 2, overflow: 'hidden' }}>
            <Box
              component="video"
              src={content.fileUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'}
              controls
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </Box>
        );

      case 'PDF':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#525659', p: 3, borderRadius: 2 }}>
            {/* Toolbar */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', backgroundColor: '#323639', px: 3, py: 1, borderRadius: 10, mb: 3, color: '#FFFFFF' }}>
              <IconButton size="small" color="inherit" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                <NavigateBeforeIcon />
              </IconButton>
              <Typography variant="body2">Page {currentPage} of 12</Typography>
              <IconButton size="small" color="inherit" onClick={() => setCurrentPage((p) => Math.min(12, p + 1))}>
                <NavigateNextIcon />
              </IconButton>
              <Divider orientation="vertical" variant="middle" flexItem sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
              <IconButton size="small" color="inherit" onClick={() => setZoom((z) => Math.max(50, z - 10))}>
                <ZoomOutIcon />
              </IconButton>
              <Typography variant="caption">{zoom}%</Typography>
              <IconButton size="small" color="inherit" onClick={() => setZoom((z) => Math.min(200, z + 10))}>
                <ZoomInIcon />
              </IconButton>
            </Box>

            {/* Document sheet */}
            <Card
              sx={{
                width: `${zoom}%`,
                maxWidth: '680px',
                minHeight: '800px',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                display: 'flex',
                flexDirection: 'column',
                p: 6,
                boxShadow: 4,
                borderRadius: 1,
              }}
            >
              <Typography variant="h5" align="center" fontWeight={700} sx={{ mb: 4, textTransform: 'uppercase' }}>
                Xebia Technical Whitepaper
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Section {currentPage}: Foundational architectures
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                This is a simulated document view representing the contents of <strong>{content.fileName || 'document.pdf'}</strong>.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography>
              <Box sx={{ mt: 'auto', textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Page {currentPage} - Powered by Xebia LMS Reader</Typography>
              </Box>
            </Card>
          </Box>
        );

      case 'PPT':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#303030', p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mb: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<NavigateBeforeIcon />}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                sx={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Previous
              </Button>
              <Typography variant="subtitle2" sx={{ color: '#FFFFFF' }}>Slide {currentPage} of 5</Typography>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                endIcon={<NavigateNextIcon />}
                onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
                sx={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Next
              </Button>
            </Box>

            {/* Slide view */}
            <Card
              sx={{
                width: '100%',
                aspectRatio: '16/9',
                maxWidth: '800px',
                backgroundColor: '#6C1D5F', // Primary branding background
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 6,
                boxShadow: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="h3" fontWeight={800} gutterBottom>
                {content.name}
              </Typography>
              <Typography variant="h6" fontWeight={500} sx={{ opacity: 0.8, mb: 4 }}>
                Slide {currentPage} topic: Core concepts of development
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: '600px', opacity: 0.9 }}>
                Visual slide mockup detailing curriculum definitions for course submodule: <strong>{content.fileName}</strong>.
              </Typography>
            </Card>
          </Box>
        );

      case 'Comparison Table':
        return (
          <TableContainer component={Card} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Table sx={{ minWidth: 650 }} aria-label="comparison table">
              <TableHead sx={{ backgroundColor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Features</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Strategy A (Server-Side)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Strategy B (Client-Side)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>Hydration latency</TableCell>
                  <TableCell>Near zero (SSR / RSC loads static layout first)</TableCell>
                  <TableCell>Higher (Requires bundle parsing and runtime hook boots)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>SEO indexability</TableCell>
                  <TableCell>Excellent (Fully compiled HTML served directly)</TableCell>
                  <TableCell>Moderate (Requires crawler runtime JS execution support)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>Interactive state hooks</TableCell>
                  <TableCell>Requires client border conversion ('use client')</TableCell>
                  <TableCell>Native (Fully responsive client-side hydration)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 'Notes':
      default:
        return (
          <Card sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Lesson Notes: {content.name}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
              {content.description || 'No detailed course notes are defined for this submodule yet.'}
              
              {"\n\n"}
              <strong>Getting Started with the Syllabus:</strong>
              {"\n"}
              1. Review the accompanying PDF guidelines in the files tab.
              {"\n"}
              2. Complete the coding assignment outlined in the repository workspace.
              {"\n"}
              3. Take the modules self-assessment quiz to verify understanding.
            </Typography>
          </Card>
        );
    }
  };

  return (
    <Box>
      {/* Header bar */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button variant="outlined" color="inherit" startIcon={<ArrowBackIcon />} onClick={() => navigate(`/course/view/${content.courseId}`)}>
            Back to Course
          </Button>
          <FilePresentIcon color="primary" sx={{ fontSize: 30 }} />
          <Typography variant="h4" fontWeight={700}>
            Preview Materials
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Chip label={content.contentType} size="medium" color="secondary" />
          <StatusBadge status={content.status} />
        </Box>
      </Box>

      {/* Main Preview Container */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          {renderPreviewType()}
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
                Attachment Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">File Name</Typography>
                  <Typography variant="body2" fontWeight={600} noWrap>{content.fileName || 'No file attached'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">File Size</Typography>
                  <Typography variant="body2" fontWeight={600}>{content.fileSize || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Mapping Hierarchy</Typography>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    Course: <strong>{content.courseName}</strong>
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Module: <strong>{content.moduleName}</strong>
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Submodule: <strong>{content.submoduleName}</strong>
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Description</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {content.description || 'No description supplied.'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContentPreview;
