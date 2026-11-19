import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Public pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { InviteJoinPage } from '../pages/auth/InviteJoinPage';

// Student pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { StudentGroupPage } from '../pages/student/StudentGroupPage';
import { StudentProjectPage } from '../pages/student/StudentProjectPage';
import { StudentSubmissionPage } from '../pages/student/StudentSubmissionPage';
import { StudentFeedbackPage } from '../pages/student/StudentFeedbackPage';
import { StudentAnnouncementsPage } from '../pages/student/StudentAnnouncementsPage';
import { StudentResourcesPage } from '../pages/student/StudentResourcesPage';
import { StudentAssignmentsPage } from '../pages/student/StudentAssignmentsPage';

// Teacher pages
import { TeacherDashboard } from '../pages/teacher/TeacherDashboard';
import { TeacherGroupsPage } from '../pages/teacher/TeacherGroupsPage';
import { TeacherProjectsPage } from '../pages/teacher/TeacherProjectsPage';
import { TeacherSubmissionsPage } from '../pages/teacher/TeacherSubmissionsPage';
import { TeacherSubmissionDetailPage } from '../pages/teacher/TeacherSubmissionDetailPage';
import { TeacherEvaluationsPage } from '../pages/teacher/TeacherEvaluationsPage';
import { TeacherReportsPage } from '../pages/teacher/TeacherReportsPage';
import { TeacherAnnouncementsPage } from '../pages/teacher/TeacherAnnouncementsPage';
import { TeacherResourcesPage } from '../pages/teacher/TeacherResourcesPage';
import { TeacherAssignmentsPage } from '../pages/teacher/TeacherAssignmentsPage';
import { TeacherStudentsPage } from '../pages/teacher/TeacherStudentsPage';

// Admin pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminTeachersPage } from '../pages/admin/AdminTeachersPage';
import { AdminStudentsPage } from '../pages/admin/AdminStudentsPage';
import { AdminDepartmentsPage } from '../pages/admin/AdminDepartmentsPage';
import { AdminGroupsPage } from '../pages/admin/AdminGroupsPage';
import { AdminProjectsPage } from '../pages/admin/AdminProjectsPage';
import { AdminSubmissionsPage } from '../pages/admin/AdminSubmissionsPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

// Shared pages
import { ProfilePage } from '../pages/shared/ProfilePage';
import { SettingsPage } from '../pages/shared/SettingsPage';
import { NotificationsPage } from '../pages/shared/NotificationsPage';
import { UnauthorizedPage } from '../pages/shared/UnauthorizedPage';
import { NotFoundPage } from '../pages/shared/NotFoundPage';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, role, isLoading } = useAuth();

  const getHomeRedirect = () => {
    if (!isAuthenticated) return '/login';
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'TEACHER') return '/teacher/dashboard';
    return '/student/dashboard';
  };

  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to={getHomeRedirect()} replace />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/join/:inviteCode" element={<InviteJoinPage />} />

      {/* Authenticated Workspace Shell */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <RoleRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/student/group"
          element={
            <RoleRoute allowedRoles={['STUDENT']}>
              <StudentGroupPage />
            </RoleRoute>
          }
        />
        <Route
          path="/student/project"
          element={
            <RoleRoute allowedRoles={['STUDENT']}>
              <StudentProjectPage />
            </RoleRoute>
          }
        />
        <Route
          path="/student/submission"
          element={
            <RoleRoute allowedRoles={['STUDENT']}>
              <StudentSubmissionPage />
            </RoleRoute>
          }
        />
        <Route
          path="/student/feedback"
          element={
            <RoleRoute allowedRoles={['STUDENT']}>
              <StudentFeedbackPage />
            </RoleRoute>
          }
        />
        <Route
          path="/student/announcements"
          element={
            <RoleRoute allowedRoles={['STUDENT']}>
              <StudentAnnouncementsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/student/resources"
          element={
            <RoleRoute allowedRoles={['STUDENT']}>
              <StudentResourcesPage />
            </RoleRoute>
          }
        />
        <Route
          path="/student/assignments"
          element={
            <RoleRoute allowedRoles={['STUDENT']}>
              <StudentAssignmentsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <RoleRoute allowedRoles={['STUDENT']}>
              <NotificationsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/student/settings"
          element={
            <RoleRoute allowedRoles={['STUDENT']}>
              <SettingsPage />
            </RoleRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <RoleRoute allowedRoles={['TEACHER']}>
              <TeacherDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/students"
          element={
            <RoleRoute allowedRoles={['TEACHER']}>
              <TeacherStudentsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/groups"
          element={
            <RoleRoute allowedRoles={['TEACHER']}>
              <TeacherGroupsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/projects"
          element={
            <RoleRoute allowedRoles={['TEACHER']}>
              <TeacherProjectsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/submissions"
          element={
            <RoleRoute allowedRoles={['TEACHER']}>
              <TeacherSubmissionsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/submissions/:id"
          element={
            <RoleRoute allowedRoles={['TEACHER']}>
              <TeacherSubmissionDetailPage />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/evaluations"
          element={
            <RoleRoute allowedRoles={['TEACHER']}>
              <TeacherEvaluationsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/announcements"
          element={
            <RoleRoute allowedRoles={['TEACHER']}>
              <TeacherAnnouncementsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/resources"
          element={
            <RoleRoute allowedRoles={['TEACHER']}>
              <TeacherResourcesPage />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/assignments"
          element={
            <RoleRoute allowedRoles={['TEACHER']}>
              <TeacherAssignmentsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/reports"
          element={
            <RoleRoute allowedRoles={['TEACHER']}>
              <TeacherReportsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/teacher/settings"
          element={
            <RoleRoute allowedRoles={['TEACHER']}>
              <SettingsPage />
            </RoleRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminUsersPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminTeachersPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminStudentsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/departments"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminDepartmentsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/groups"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminGroupsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminProjectsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/submissions"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminSubmissionsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminReportsPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminSettingsPage />
            </RoleRoute>
          }
        />

        {/* Shared Authenticated Routes */}
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Error / Fallback Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
