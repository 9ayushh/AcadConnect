# AcadConnect — Frontend (Academic Group Project Management Platform)

AcadConnect is a modern, student-centred Academic Group Project Management Platform engineered with a contemporary SaaS productivity aesthetic (reminiscent of Linear and Notion) rather than traditional college ERP interfaces.

Built using **React 18 + TypeScript + Vite + Tailwind CSS**, it features full offline demo capabilities via a comprehensive **Mock API layer**, role-based workspaces for **Student**, **Teacher**, and **Admin**, two-level academic groups, real-time submission checklists, milestone tracking, and accreditation-ready **Excel exports**.

---

## Quick Start & Running the Project

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Installation & Development
```bash
# 1. Install dependencies
npm install

# 2. Run the development server (Defaults to Mock Mode)
npm run dev

# 3. Production build (TypeScript validation + Vite bundle)
npm run build

# 4. Preview production build
npm run preview
```
The application will launch at `http://localhost:3000`.

---

## Demo Accounts (Mock Mode)

In Mock Mode (`VITE_USE_MOCKS=true`), demo accounts are pre-configured with complete mock datasets. You can either use the quick-fill buttons on the login page or the **Role Switcher** in the top navigation bar:

| Role | Email | Password | Pre-seeded Workspace State |
|---|---|---|---|
| **Student** | `student@example.com` | `password123` | Aarav Sharma (21CSE001). Active Subgroup "Alpha Synapse", Capstone Project "Distributed Health AI", Sprint 3 submission with feedback. |
| **Teacher** | `teacher@example.com` | `password123` | Dr. Rajesh Kumar (CSE). Manages "CS491 - Capstone Major Projects", 4 subgroups, reviews submissions, posts announcements, and exports Excel reports. |
| **Admin** | `admin@example.com` | `password123` | System Administrator. System-wide user provisioning, teacher/student directories, departmental quotas, and accreditation audit reports. |

---

## Environment Variables

Configure environment settings in `.env`:

```env
# Spring Boot REST API Base URL (when switching to real backend)
VITE_API_BASE_URL=http://localhost:8080/api

# Enable mock API adapter (set to false to communicate with live Spring Boot backend)
VITE_USE_MOCKS=true
```

### Switching From Mocks to Live Spring Boot Backend
1. Set `VITE_USE_MOCKS=false` in `.env`.
2. Ensure your Spring Boot backend is running on `http://localhost:8080` (or update `VITE_API_BASE_URL`).
3. Spring Boot CORS should allow credentials (`Access-Control-Allow-Credentials: true`) and origin `http://localhost:3000`.

---

## Architecture & Source Code Layout

```text
src/
├── assets/                  # Icons, SVG assets, brand graphics
├── components/
│   ├── common/              # Button, Input, Select, Modal, Badge, StatusPill, Loader/Skeleton,
│   │                        # EmptyState, ConfirmDialog, FileUpload, StatCard, DataTable, PageHeader
│   ├── layout/              # Sidebar, Topbar, DashboardLayout, MobileNavigation
│   ├── dashboard/           # WelcomeHeader, QuickStats, ActiveProjectCard, ProgressBar,
│   │                        # UpcomingDeadline, RecentActivity, TeamMembers, QuickActions
│   ├── group/               # GroupCard, MemberList, CreateGroupModal, SubgroupCard, InviteLinkBox
│   ├── project/             # ProjectCard, MilestoneList
│   ├── submission/          # SubmissionHeader, GithubInput, FileUpload, Checklist
│   ├── review/              # ReviewForm, ReviewHistory
│   └── communication/       # AnnouncementCard, MessageBox, ResourceCard, AssignmentCard
├── context/                 # AuthContext.tsx (in-memory JWT & HttpOnly cookie support)
├── pages/
│   ├── auth/                # LoginPage, RegisterPage, ForgotPasswordPage, InviteJoinPage
│   ├── student/             # StudentDashboard, StudentGroupPage, StudentProjectPage,
│   │                        # StudentSubmissionPage, StudentFeedbackPage, StudentAnnouncementsPage,
│   │                        # StudentResourcesPage, StudentAssignmentsPage
│   ├── teacher/             # TeacherDashboard, TeacherGroupsPage, TeacherProjectsPage,
│   │                        # TeacherSubmissionsPage, TeacherSubmissionDetailPage,
│   │                        # TeacherEvaluationsPage, TeacherReportsPage, TeacherAnnouncementsPage,
│   │                        # TeacherResourcesPage, TeacherAssignmentsPage, TeacherStudentsPage
│   ├── admin/               # AdminDashboard, AdminUsersPage, AdminTeachersPage, AdminStudentsPage,
│   │                        # AdminDepartmentsPage, AdminGroupsPage, AdminProjectsPage,
│   │                        # AdminSubmissionsPage, AdminReportsPage, AdminSettingsPage
│   └── shared/              # ProfilePage, SettingsPage, NotificationsPage, UnauthorizedPage, NotFoundPage
├── routes/                  # AppRoutes.tsx, ProtectedRoute.tsx, RoleRoute.tsx
├── services/                # api.ts (Axios client), authService, groupService, projectService,
│                            # submissionService, reviewService, reportService, announcementService,
│                            # resourceService, assignmentService, notificationService, userService
├── types/                   # Comprehensive TypeScript domain models & interfaces
├── mocks/                   # Realistic seed data and Axios mock adapter
├── utils/                   # constants.ts, formatters.ts, validators.ts (Zod schemas)
├── App.tsx                  # Root component with QueryClient, Router, Toaster
└── main.tsx                 # Entrypoint
```

---

## Architectural Decisions & Assumptions Made

1. **Role Security Boundary**:
   - Public self-service registration creates `STUDENT` accounts only.
   - Privileged roles (`TEACHER`, `ADMIN`) cannot be registered from public forms; they are provisioned exclusively by administrators or through an approved backend invitation flow.
   - Frontend route guards (`ProtectedRoute`, `RoleRoute`) enhance UX and prevent navigation mismatch, while the Spring Boot REST API remains the authoritative security boundary.
2. **Session & Token Management**:
   - In accordance with §0 and §13, tokens are kept **in memory only** (never in `localStorage` or `sessionStorage`), with refresh capability on load.
   - On logout, all user-specific state and TanStack Query server caches are completely evicted.
3. **Subgroup Constraints**:
   - Enforces a **maximum of 3 students per subgroup** (including the creator), with capacity counters ("2 of 3 slots used").
   - Students only see their own subgroup; access to other subgroups is blocked with 403 authorization handling.
4. **Excel Export**:
   - Downloads `.xlsx` blobs triggered via `responseType: 'blob'`, reading filenames from `Content-Disposition`.
   - Supports 4 scopes: Entire Main Group, Individual Subgroup, Assignment-wise, and URL-filtered view.
5. **Accessibility & Design Tokens**:
   - Color tokens: Indigo `#4F46E5`, Dark `#111827`, Canvas `#F8FAFC`, Border `#E2E8F0`.
   - Status is never communicated by color alone — every state is accompanied by a text label.
   - Respects `prefers-reduced-motion` across Framer Motion transitions.

---

## Acceptance Criteria Mapping (§18)

| Acceptance Criterion | Satisfying Files / Modules |
|---|---|
| **Separate dashboards & navigation for Admin, Teacher, Student** | [`StudentDashboard.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/student/StudentDashboard.tsx), [`TeacherDashboard.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/teacher/TeacherDashboard.tsx), [`AdminDashboard.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/admin/AdminDashboard.tsx), [`Sidebar.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/layout/Sidebar.tsx) |
| **Role-aware routes & menus (including Unauthorized & 404)** | [`AppRoutes.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/routes/AppRoutes.tsx), [`RoleRoute.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/routes/RoleRoute.tsx), [`ProtectedRoute.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/routes/ProtectedRoute.tsx), [`UnauthorizedPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/shared/UnauthorizedPage.tsx), [`NotFoundPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/shared/NotFoundPage.tsx) |
| **All forms show clear validation messages** | [`validators.ts`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/utils/validators.ts), [`Input.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/common/Input.tsx), [`RegisterPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/auth/RegisterPage.tsx), [`LoginPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/auth/LoginPage.tsx) |
| **Teacher can create groups and select students** | [`CreateGroupModal.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/group/CreateGroupModal.tsx), [`TeacherGroupsPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/teacher/TeacherGroupsPage.tsx), [`groupService.ts`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/services/groupService.ts) |
| **Students can view assigned group and project** | [`StudentGroupPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/student/StudentGroupPage.tsx), [`StudentProjectPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/student/StudentProjectPage.tsx), [`ActiveProjectCard.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/dashboard/ActiveProjectCard.tsx) |
| **Join main group via invite link & create subgroup (max 3)** | [`InviteJoinPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/auth/InviteJoinPage.tsx), [`InviteLinkBox.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/group/InviteLinkBox.tsx), [`StudentGroupPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/student/StudentGroupPage.tsx), [`mockAdapter.ts`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/mocks/mockAdapter.ts) |
| **Enter GitHub URL and upload required files (project file + synopsis)** | [`GithubInput.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/submission/GithubInput.tsx), [`FileUpload.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/common/FileUpload.tsx), [`StudentSubmissionPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/student/StudentSubmissionPage.tsx) |
| **File upload shows progress, errors, retry behaviour** | [`FileUpload.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/common/FileUpload.tsx) |
| **Submission status visible & editable until locked** | [`StatusPill.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/common/StatusPill.tsx), [`SubmissionHeader.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/submission/SubmissionHeader.tsx), [`StudentSubmissionPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/student/StudentSubmissionPage.tsx) |
| **Teachers review submissions (feedback required on revision/reject) & send reminders** | [`ReviewForm.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/review/ReviewForm.tsx), [`TeacherSubmissionDetailPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/teacher/TeacherSubmissionDetailPage.tsx), [`reviewService.ts`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/services/reviewService.ts) |
| **Teacher announcements, subgroup messaging, resources, assignments** | [`TeacherAnnouncementsPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/teacher/TeacherAnnouncementsPage.tsx), [`MessageBox.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/communication/MessageBox.tsx), [`TeacherResourcesPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/teacher/TeacherResourcesPage.tsx), [`TeacherAssignmentsPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/teacher/TeacherAssignmentsPage.tsx) |
| **Admin records management & Excel export (main group, subgroup, assignment, filtered)** | [`TeacherReportsPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/teacher/TeacherReportsPage.tsx), [`AdminDashboard.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/admin/AdminDashboard.tsx), [`AdminUsersPage.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/pages/admin/AdminUsersPage.tsx), [`reportService.ts`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/services/reportService.ts) |
| **Loading, empty, success, and error states handled on all data screens** | [`Loader.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/common/Loader.tsx), [`EmptyState.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/common/EmptyState.tsx), [`DataTable.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/common/DataTable.tsx) |
| **Responsive design for desktop, tablet, and mobile** | [`DashboardLayout.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/layout/DashboardLayout.tsx), [`MobileNavigation.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/layout/MobileNavigation.tsx), [`Sidebar.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/layout/Sidebar.tsx) |
| **Keyboard navigation, focus rings, accessible labels, reduced motion** | [`index.css`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/index.css), [`Button.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/common/Button.tsx), [`Modal.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/common/Modal.tsx), [`Input.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/components/common/Input.tsx) |
| **No tokens in localStorage; caches cleared on logout** | [`AuthContext.tsx`](file:///c:/Users/vivek/OneDrive/Desktop/Ayush/AcadConnect/src/context/AuthContext.tsx) |
