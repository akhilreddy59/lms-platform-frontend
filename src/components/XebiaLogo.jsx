import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

const XebiaLogo = ({ width = 140, height = 36, variant = 'auto' }) => {
  const theme = useTheme();
  
  // Decide color based on variant or theme
  const isDark = theme.palette.mode === 'dark';
  const textColor = variant === 'white' || (variant === 'auto' && isDark) 
    ? '#FFFFFF' 
    : '#6C1D5F'; // Brand purple

  return (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 350 90"
      width={width}
      height={height}
      sx={{ display: 'block', transition: 'fill 0.3s ease' }}
    >
      {/* Stylized Xebia "X" */}
      <path
        d="M20 12 L65 12 L100 48 L135 12 L180 12 L125 56 L180 100 L135 100 L100 64 L65 100 L20 100 L75 56 Z"
        fill={textColor}
      />
      {/* "ebia" Wordmark Text */}
      <text
        x="195"
        y="82"
        fontFamily='"Outfit", "Inter", sans-serif'
        fontSize="82"
        fontWeight="800"
        fill={textColor}
        letterSpacing="-3"
      >
        ebia
      </text>
    </Box>
  );
};

export default XebiaLogo;
