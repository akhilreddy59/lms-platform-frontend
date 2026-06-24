import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import SettingsIcon from '@mui/icons-material/Settings';
import PaletteIcon from '@mui/icons-material/Palette';
import ShieldIcon from '@mui/icons-material/Shield';

import { useUI } from '../context/UIContext';

const Settings = () => {
  const { showToast, themeMode, toggleTheme } = useUI();

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Settings saved successfully!', 'success');
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SettingsIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure global platform behaviors, branding settings, and default parameters.
          </Typography>
        </Box>
      </Box>

      <form onSubmit={handleSave}>
        <Grid container spacing={3}>
          {/* General Platform Settings */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  General Settings
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Platform Name"
                    defaultValue="Xebia LMS Platform"
                    fullWidth
                  />
                  <TextField
                    label="Support Contact Email"
                    defaultValue="support@xebia.com"
                    fullWidth
                  />
                  <TextField
                    label="Default Rows Per Page"
                    defaultValue="10"
                    type="number"
                    fullWidth
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Theme & Branding Customization */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }} gutterBottom>
                  <PaletteIcon color="secondary" /> Theme & Branding
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={themeMode === 'dark'}
                        onChange={toggleTheme}
                        color="primary"
                      />
                    }
                    label={`Enable Dark Mode (Current: ${themeMode.toUpperCase()})`}
                  />

                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                      Brand Color Swatch
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: 2, backgroundColor: '#6C1D5F', border: '1px solid #E0E0E0' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>#6C1D5F</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: 2, backgroundColor: '#84117C', border: '1px solid #E0E0E0' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>#84117C</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: 2, backgroundColor: '#01AC9F', border: '1px solid #E0E0E0' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>#01AC9F</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: 2, backgroundColor: '#FF6200', border: '1px solid #E0E0E0' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>#FF6200</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Security & Access Policies (UI Only) */}
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }} gutterBottom>
                  <ShieldIcon color="primary" /> Security & Access Policies
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={<Switch defaultChecked color="success" />}
                      label="Enforce Two-Factor Auth (2FA)"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={<Switch defaultChecked color="success" />}
                      label="Allow Public Self-Registration"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={<Switch color="primary" />}
                      label="Log API Ingress Sessions"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Settings
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Settings;
