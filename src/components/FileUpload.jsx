import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useContents } from '../hooks/useContents';
import { useUI } from '../context/UIContext';

const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf':
      return <PictureAsPdfIcon sx={{ color: '#D32F2F' }} />;
    case 'ppt':
    case 'pptx':
      return <SlideshowIcon sx={{ color: '#E65100' }} />;
    case 'mp4':
      return <MovieIcon sx={{ color: '#0288D1' }} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <ImageIcon sx={{ color: '#4CAF50' }} />;
    default:
      return <InsertDriveFileIcon sx={{ color: '#757575' }} />;
  }
};

const FileUpload = ({ onUploadComplete, multiple = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const { useUploadFileMutation } = useContents();
  const uploadMutation = useUploadFileMutation();
  const { showToast } = useUI();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = async (newFilesList) => {
    const list = Array.from(newFilesList);
    const validFiles = [];

    // Filter out duplicate names
    const currentNames = files.map((f) => f.name);
    
    for (const file of list) {
      if (currentNames.includes(file.name)) {
        showToast(`File "${file.name}" is already added.`, 'warning');
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // If not multiple, clear current files and take only first
    const filesToUpload = multiple ? validFiles : [validFiles[0]];
    
    // Add files to state with 0% progress and 'pending' status
    const initialFilesState = filesToUpload.map((file) => ({
      id: `${file.name}-${Date.now()}`,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading',
      error: null,
      details: null,
    }));

    setFiles((prev) => multiple ? [...prev, ...initialFilesState] : initialFilesState);

    // Upload each file
    for (const fileObj of initialFilesState) {
      const fileToUpload = filesToUpload.find((f) => f.name === fileObj.name);
      
      try {
        const uploadResult = await uploadMutation.mutateAsync({
          file: fileToUpload,
          onProgress: (progress) => {
            setFiles((prev) =>
              prev.map((f) => (f.id === fileObj.id ? { ...f, progress } : f))
            );
          },
        });

        setFiles((prev) => {
          const updated = prev.map((f) =>
            f.id === fileObj.id
              ? { ...f, status: 'success', progress: 100, details: uploadResult }
              : f
          );
          
          // Trigger complete callback
          const completedFiles = updated
            .filter((f) => f.status === 'success')
            .map((f) => f.details);
          
          if (onUploadComplete) {
            onUploadComplete(multiple ? completedFiles : completedFiles[0]);
          }
          
          return updated;
        });

        showToast(`File "${fileObj.name}" uploaded successfully!`, 'success');
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id
              ? { ...f, status: 'error', progress: 0, error: err.message }
              : f
          )
        );
        showToast(err.message || 'File upload failed.', 'error');
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      const completedFiles = updated
        .filter((f) => f.status === 'success')
        .map((f) => f.details);
      
      if (onUploadComplete) {
        onUploadComplete(multiple ? completedFiles : (completedFiles[0] || null));
      }
      return updated;
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        sx={{
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          backgroundColor: dragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          multiple={multiple}
          onChange={handleChange}
          accept=".pdf,.ppt,.pptx,.docx,.mp4,image/*"
        />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
        <Typography variant="h6" gutterBottom>
          Drag and drop files here
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Supported: PDF, PPT, DOCX, MP4, Images (Max 100MB)
        </Typography>
        <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}>
          Select Files
        </Button>
      </Box>

      {files.length > 0 && (
        <List sx={{ mt: 2 }}>
          {files.map((fileObj) => (
            <ListItem
              key={fileObj.id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
                mb: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                backgroundColor: 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', p: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getFileIcon(fileObj.name)}
                </ListItemIcon>
                <ListItemText
                  primary={fileObj.name}
                  secondary={
                    fileObj.status === 'error' ? (
                      <Typography variant="caption" color="error">
                        {fileObj.error}
                      </Typography>
                    ) : (
                      `${(fileObj.size / (1024 * 1024)).toFixed(2)} MB`
                    )
                  }
                  sx={{ my: 0 }}
                />
                
                {fileObj.status === 'success' && (
                  <CheckCircleOutlineIcon sx={{ color: 'success.main', mr: 1 }} />
                )}

                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveFile(fileObj.id)}
                  disabled={fileObj.status === 'uploading'}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              {fileObj.status === 'uploading' && (
                <Box sx={{ width: '100%', px: 2, pb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Uploading...
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fileObj.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={fileObj.progress} sx={{ height: 4, borderRadius: 2 }} />
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileUpload;
