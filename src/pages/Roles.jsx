import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ShieldIcon from '@mui/icons-material/Shield';

const permissionsMatrix = [
  { feature: 'Category CRUD Management', Admin: true, Manager: true, Trainer: false, Organizer: false, Student: false },
  { feature: 'Course CRUD Management', Admin: true, Manager: true, Trainer: true, Organizer: false, Student: false },
  { feature: 'Module Reordering (D&D)', Admin: true, Manager: true, Trainer: true, Organizer: false, Student: false },
  { feature: 'Submodule Reordering (D&D)', Admin: true, Manager: true, Trainer: true, Organizer: false, Student: false },
  { feature: 'Content Reordering (D&D)', Admin: true, Manager: true, Trainer: true, Organizer: false, Student: false },
  { feature: 'File Upload & Verification', Admin: true, Manager: true, Trainer: true, Organizer: true, Student: false },
  { feature: 'Settings Access', Admin: true, Manager: false, Trainer: false, Organizer: false, Student: false },
  { feature: 'Course Viewing (Frontend)', Admin: true, Manager: true, Trainer: true, Organizer: true, Student: true },
];

const Roles = () => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ShieldIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Roles & Permissions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Matrix view of system access permissions for each user role role. (Admin is fully enabled).
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Feature Authorization Matrix
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="roles table">
              <TableHead sx={{ backgroundColor: (theme) => theme.palette.action.hover }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>System Features / Actions</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: 'primary.main' }}>Admin</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Manager</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Trainer</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Organizer</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Student</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permissionsMatrix.map((row) => (
                  <TableRow
                    key={row.feature}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                      {row.feature}
                    </TableCell>
                    <TableCell align="center">
                      {row.Admin ? <CheckBoxIcon color="primary" /> : <CheckBoxOutlineBlankIcon color="action" />}
                    </TableCell>
                    <TableCell align="center">
                      {row.Manager ? <CheckBoxIcon sx={{ color: '#01AC9F' }} /> : <CheckBoxOutlineBlankIcon color="action" />}
                    </TableCell>
                    <TableCell align="center">
                      {row.Trainer ? <CheckBoxIcon sx={{ color: '#FF6200' }} /> : <CheckBoxOutlineBlankIcon color="action" />}
                    </TableCell>
                    <TableCell align="center">
                      {row.Organizer ? <CheckBoxIcon sx={{ color: '#0288D1' }} /> : <CheckBoxOutlineBlankIcon color="action" />}
                    </TableCell>
                    <TableCell align="center">
                      {row.Student ? <CheckBoxIcon sx={{ color: 'text.secondary' }} /> : <CheckBoxOutlineBlankIcon color="action" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Roles;
