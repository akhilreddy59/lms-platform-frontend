import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guards
import AdminLayout from '../layouts/AdminLayout';

// Auth Pages
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';

// Admin Core Pages
import Dashboard from '../pages/Dashboard';
import Settings from '../pages/Settings';
import Users from '../pages/Users';
import Roles from '../pages/Roles';

// Category CRUD Pages
import CategoryList from '../pages/Category/CategoryList';
import CategoryForm from '../pages/Category/CategoryForm';

// Course CRUD Pages
import CourseList from '../pages/Course/CourseList';
import CourseForm from '../pages/Course/CourseForm';
import CourseView from '../pages/Course/CourseView';

// Module CRUD Pages
import ModuleList from '../pages/Module/ModuleList';
import ModuleForm from '../pages/Module/ModuleForm';

// Submodule CRUD Pages
import SubmoduleList from '../pages/Submodule/SubmoduleList';
import SubmoduleForm from '../pages/Submodule/SubmoduleForm';

// Content CRUD Pages
import ContentList from '../pages/Content/ContentList';
import ContentForm from '../pages/Content/ContentForm';
import ContentPreview from '../pages/Content/ContentPreview';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Admin Console Pages */}
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Category Routes */}
        <Route path="/category" element={<CategoryList />} />
        <Route path="/category/add" element={<CategoryForm />} />
        <Route path="/category/edit/:id" element={<CategoryForm />} />

        {/* Course Routes */}
        <Route path="/course" element={<CourseList />} />
        <Route path="/course/add" element={<CourseForm />} />
        <Route path="/course/edit/:id" element={<CourseForm />} />
        <Route path="/course/view/:id" element={<CourseView />} />

        {/* Module Routes */}
        <Route path="/module" element={<ModuleList />} />
        <Route path="/module/add" element={<ModuleForm />} />
        <Route path="/module/edit/:id" element={<ModuleForm />} />

        {/* Submodule Routes */}
        <Route path="/submodule" element={<SubmoduleList />} />
        <Route path="/submodule/add" element={<SubmoduleForm />} />
        <Route path="/submodule/edit/:id" element={<SubmoduleForm />} />

        {/* Content Routes */}
        <Route path="/content" element={<ContentList />} />
        <Route path="/content/add" element={<ContentForm />} />
        <Route path="/content/edit/:id" element={<ContentForm />} />
        <Route path="/content/preview/:id" element={<ContentPreview />} />

        {/* Mock Management Views */}
        <Route path="/users" element={<Users />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/settings" element={<Settings />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
