import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';

// Icons
import FolderIcon from '@mui/icons-material/Folder';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UpdateIcon from '@mui/icons-material/Update';

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

import { getDBTable } from '../utils/dbInit';
import { useCategories } from '../hooks/useCategories';
import { useCourses } from '../hooks/useCourses';
import { useModules } from '../hooks/useModules';
import { useSubmodules } from '../hooks/useSubmodules';
import { useContents } from '../hooks/useContents';

const Dashboard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Load lists via React Query hooks
  const categoriesQuery = useCategories().useList();
  const coursesQuery = useCourses().useList();
  const modulesQuery = useModules().useList();
  const submodulesQuery = useSubmodules().useList();
  const contentsQuery = useContents().useList();

  // Load recent activities
  const { data: activities = [], isLoading: isActLoading } = useQuery({
    queryKey: ['recent_activities'],
    queryFn: () => getDBTable('recent_activities'),
  });

  const isLoading =
    categoriesQuery.isLoading ||
    coursesQuery.isLoading ||
    modulesQuery.isLoading ||
    submodulesQuery.isLoading ||
    contentsQuery.isLoading ||
    isActLoading;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Raw counts
  const categoriesCount = categoriesQuery.data?.length || 0;
  const coursesCount = coursesQuery.data?.length || 0;
  const modulesCount = modulesQuery.data?.length || 0;
  const submodulesCount = submodulesQuery.data?.length || 0;
  const contentsCount = contentsQuery.data?.length || 0;

  // 1. Data for Course Statistics: Number of modules and submodules per course
  const courseStatsData = (coursesQuery.data || []).map((course) => {
    const courseModules = (modulesQuery.data || []).filter((m) => m.courseId === course.id);
    const courseModulesIds = courseModules.map((m) => m.id);
    const courseSubmodules = (submodulesQuery.data || []).filter((s) => courseModulesIds.includes(s.moduleId));
    
    return {
      name: course.name.length > 20 ? `${course.name.substring(0, 20)}...` : course.name,
      Modules: courseModules.length,
      Submodules: courseSubmodules.length,
    };
  });

  // 2. Data for Content Distribution: Content Type breakdown
  const contentTypes = ['Notes', 'PDF', 'PPT', 'Comparison Table', 'Video'];
  const contentDistributionData = contentTypes.map((type) => {
    const count = (contentsQuery.data || []).filter((c) => c.contentType === type).length;
    return { name: type, value: count };
  }).filter((item) => item.value > 0);

  // Chart Palettes
  const CHART_COLORS = ['#6C1D5F', '#84117C', '#01AC9F', '#FF6200', '#9D92B2'];

  const statCards = [
    {
      title: 'Total Categories',
      count: categoriesCount,
      trend: '+1 this week',
      icon: <FolderIcon sx={{ fontSize: 28 }} />,
      color: '#6C1D5F', // Primary Purple
      bg: 'rgba(108, 29, 95, 0.06)',
    },
    {
      title: 'Total Courses',
      count: coursesCount,
      trend: '+2 new courses',
      icon: <MenuBookIcon sx={{ fontSize: 28 }} />,
      color: '#84117C', // Secondary Bright Purple
      bg: 'rgba(132, 17, 124, 0.06)',
    },
    {
      title: 'Total Modules',
      count: modulesCount,
      trend: '+3 this month',
      icon: <ViewModuleIcon sx={{ fontSize: 28 }} />,
      color: '#01AC9F', // Success Emerald
      bg: 'rgba(1, 172, 159, 0.06)',
    },
    {
      title: 'Total Submodules',
      count: submodulesCount,
      trend: '+4 templates',
      icon: <SubtitlesIcon sx={{ fontSize: 28 }} />,
      color: '#FF6200', // Warning Orange
      bg: 'rgba(255, 98, 0, 0.06)',
    },
    {
      title: 'Total Content',
      count: contentsCount,
      trend: '+12 files uploaded',
      icon: <DescriptionIcon sx={{ fontSize: 28 }} />,
      color: '#5C4F61',
      bg: 'rgba(92, 79, 97, 0.06)',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Welcome Heading */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'text.primary' }}>
          Welcome back, Admin!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here is what is happening across Xebia LMS Platform today.
        </Typography>
      </Box>

      {/* Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={2.4} key={card.title}>
            <Card
              sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                borderColor: isDark ? 'divider' : 'transparent',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  backgroundColor: card.color,
                },
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 1,
                      borderRadius: 2,
                      color: card.color,
                      backgroundColor: card.bg,
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: '#01AC9F', gap: 0.2 }}>
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" fontWeight={600}>
                      {card.trend}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
                  {card.title}
                </Typography>
                <Typography variant="h4" fontWeight={800} color="text.primary">
                  {card.count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Course Statistics Bar Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Course Structure Statistics
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
                Distribution of Modules and Submodules across active courses
              </Typography>

              <Box sx={{ width: '100%', height: 320 }}>
                {courseStatsData.length > 0 ? (
                  <ResponsiveContainer>
                    <BarChart data={courseStatsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#2E2E2E' : '#E0E0E0'} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.palette.text.secondary }} />
                      <YAxis tick={{ fontSize: 11, fill: theme.palette.text.secondary }} />
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                          borderColor: theme.palette.divider,
                          borderRadius: 8,
                          color: theme.palette.text.primary,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, pt: 10 }} />
                      <Bar dataKey="Modules" fill="#6C1D5F" radius={[4, 4, 0, 0]} barSize={24} />
                      <Bar dataKey="Submodules" fill="#01AC9F" radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">No course statistics available.</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Content Distribution Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Content Distribution
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
                Breakdown of course learning materials by format
              </Typography>

              <Box sx={{ width: '100%', height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {contentDistributionData.length > 0 ? (
                  <>
                    <Box sx={{ width: '100%', height: 240 }}>
                      <ResponsiveContainer>
                        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <Pie
                            data={contentDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {contentDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip
                            contentStyle={{
                              backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                              borderColor: theme.palette.divider,
                              borderRadius: 8,
                              color: theme.palette.text.primary,
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                    {/* Legend */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 1 }}>
                      {contentDistributionData.map((item, index) => (
                        <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            {item.name} ({item.value})
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </>
                ) : (
                  <Typography color="text.secondary">No content files uploaded yet.</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Recent Activities
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
                  <UpdateIcon fontSize="small" />
                  <Typography variant="caption" fontWeight={600}>
                    Real-time Logs
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {activities.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {activities.map((activity) => (
                    <Box
                      key={activity.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(108, 29, 95, 0.02)',
                        border: '1px solid',
                        borderColor: isDark ? 'divider' : 'rgba(108, 29, 95, 0.04)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor:
                              activity.type === 'success'
                                ? '#01AC9F'
                                : activity.type === 'warning'
                                ? '#FF6200'
                                : '#6C1D5F',
                          }}
                        />
                        <Typography variant="body2" color="text.primary" fontWeight={500}>
                          {activity.text}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(activity.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary" variant="body2">
                    No recent activities logged yet.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
