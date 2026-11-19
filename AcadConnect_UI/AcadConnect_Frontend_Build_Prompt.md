# MASTER PROMPT — Build the Frontend for "AcadConnect" (Academic Group Project Management Platform)

You are a senior React + TypeScript engineer and UI/UX designer. Build the **complete frontend** of the Academic Group Project Management Platform described below. Follow every section. Do not skip any page, component, state, validation rule, route or acceptance criterion. If something is ambiguous, pick the most reasonable option, state the assumption in the README, and continue.

**Scope:** FRONTEND ONLY. Do NOT build the backend, database, server-side file storage, or Excel generation. The frontend only calls the Spring Boot REST APIs (and triggers the Excel export endpoint). Because the backend may not be running, also include a **mock API layer** (see §17) so the whole app works and can be demoed offline.

---

## 0. Decisions already made (read first)

The product comes from two source documents (a project idea document and a Frontend Low-Level Design). Where they differ, use these decisions:

| Topic | Decision |
|---|---|
| Language / tooling | React + **TypeScript** + **Vite** (use `.tsx`/`.ts`; keep the LLD folder layout otherwise). |
| Roles | Three roles: `ADMIN`, `TEACHER`, `STUDENT`. Each has a separate workspace, dashboard and navigation. |
| Registration | Public registration creates a **STUDENT** account only. There is **no role dropdown** for privileged roles. Teacher/Admin accounts come from an administrator or an approved invitation flow. Never trust a role value supplied by the browser; take the role from the backend response. |
| Session | Prefer **HttpOnly secure cookies** (`withCredentials: true`, CSRF header support). If the API instead returns a JWT in the response body, keep the access token **in memory only** (never `localStorage`/`sessionStorage`) and rely on the refresh endpoint (`POST /api/auth/refresh`) on page load. Clear all user-specific cached data on logout. |
| Group model | Two levels, as in the idea doc: **Main academic group** (teacher-owned, joined by invite link) and **Project subgroup** (max **3 students**, inside a main group). The LLD's "group management" (teacher selects students, leader, project) applies to teacher-managed project groups; the idea doc's student-created subgroups also exist. Support both. |
| Submission status | Combine both lifecycles (see §9.3). Always show a text label with colour. |
| Nav labels | Use the LLD's sidebar items and add the idea doc's items (Announcements, Resources, Assignments) where they fit (see §5). |

---

## 1. Product & UX goals

Feel like a **modern productivity / SaaS app, not a traditional college ERP.** Students should immediately understand what they are working on, what is due next, and whether an action succeeded.

| UX principle | How to implement |
|---|---|
| Clarity | Clear labels, concise descriptions, visible statuses, predictable navigation. |
| Low cognitive load | Prioritise the next useful action; no overcrowded dashboards. |
| Progress visibility | Show milestones and meaningful completion states. |
| Positive reinforcement | Calm success messages; acknowledge completed work. |
| Deadline awareness | Show dates and urgency clearly **without** excessive alarm styling. |
| Consistency | Reuse the same buttons, cards, forms, spacing, navigation patterns. |
| Accessibility | Readable contrast, keyboard access, labels, reduced-motion support. |

### Student-centred design (highest priority)
The student dashboard must answer four questions at a glance: **(1) What am I working on? (2) How is it progressing? (3) What do I need to submit? (4) What is my next deadline?**

**Avoid:** punitive leaderboards, excessive notifications, flashing alerts, arbitrary progress scores. Progress must come from real milestones/tasks. Always pair status colours with text labels.

---

## 2. Visual design system

**Direction:** calm, modern SaaS look — light neutral background, white content surfaces, dark readable text, **indigo** primary action colour, generous whitespace, consistent card spacing. Rounded but restrained corners, subtle borders, light shadows only to create hierarchy.

### Colour tokens (put in `tailwind.config` / CSS variables)
| Token | Value | Usage |
|---|---|---|
| Primary | `#4F46E5` | Primary actions, active navigation, links |
| Primary dark | `#111827` | Sidebar, headings, high-emphasis text |
| Page background | `#F8FAFC` | Application canvas |
| Surface | `#FFFFFF` | Cards, forms, dialogs |
| Border | `#E2E8F0` | Dividers, component outlines |
| Success | `#16A34A` | Completed / approved |
| Warning | `#D97706` | Upcoming / revision needed |
| Error | `#DC2626` | Errors / rejected |
| Information | `#2563EB` | Submitted / informational |

### Typography (font: **Inter**)
| Element | Size | Weight |
|---|---|---|
| Page heading | 28–32 px | 700 |
| Section heading | 20–24 px | 600 |
| Card heading | 16–18 px | 600 |
| Body | 14–16 px | 400 |
| Supporting text | 12–13 px | 400 |
| Button | 14 px | 600 |

Use a spacing scale in **4 px increments**. Dark mode is optional; if added, it must not reduce contrast.

---

## 3. Technology stack (keep it lean)

| Technology | Responsibility |
|---|---|
| React.js + TypeScript + Vite | Component-based UI, tooling |
| React Router | Client-side navigation |
| Tailwind CSS | Responsive styling, design tokens |
| Lucide React | Icons |
| Axios | HTTP (single shared instance) |
| React Hook Form | Form state |
| Zod | Schema validation (via `@hookform/resolvers/zod`) |
| Context API | Auth + small shared state |
| TanStack Query | Server-state caching, refetching, mutations |
| Recharts | Dashboard charts only where useful |
| React Hot Toast | Non-blocking notifications |
| Framer Motion | Subtle transitions (respect reduced motion) |
| React Dropzone | File selection + drag-and-drop |

Do **not** add Redux Toolkit unless cross-page client state becomes genuinely complex. Include ESLint + Prettier.

---

## 4. Architecture

Modular, component-based. Separate **pages**, **reusable UI components**, **API services**, **routing**, **hooks**, and **shared state**.

```
React Application
├── Public routes: Login, Register, Forgot Password, Invite Join (/join/:inviteCode)
└── Protected application
    ├── Admin workspace
    ├── Teacher workspace
    ├── Student workspace
    ├── Shared layout and UI components
    └── Frontend services: API client, Authentication service, File upload service, Report service
                         │
                         ▼
                 Spring Boot REST APIs
```

### Required source structure
```
src/
├── assets/ { images/, icons/, fonts/ }
├── components/
│   ├── common/  Button, Input, Select, Modal, Badge, StatusPill, Loader(Skeleton), EmptyState,
│   │            ConfirmDialog, FileUpload, StatCard, DataTable, PageHeader
│   ├── layout/  Sidebar, Topbar, DashboardLayout, PageHeader, MobileNavigation
│   ├── dashboard/   (WelcomeHeader, QuickStats, ActiveProjectCard, ProgressBar,
│   │                 UpcomingDeadline, RecentActivity, TeamMembers, QuickActions)
│   ├── group/       (GroupCard, MemberList, CreateGroupModal, SubgroupCard, InviteLinkBox …)
│   ├── project/     (ProjectCard, MilestoneList, …)
│   ├── submission/  (SubmissionHeader, GithubInput, SubmissionFileUpload, SynopsisUpload,
│   │                 DescriptionInput, SubmissionChecklist, SubmitButton, SubmissionStatus …)
│   ├── review/      (ReviewForm, ReviewHistory …)
│   └── communication/ (AnnouncementCard, MessageBox, ResourceCard, AssignmentCard)
├── pages/ { auth/, student/, teacher/, admin/ }
├── services/ api.ts, authService.ts, groupService.ts, projectService.ts, submissionService.ts,
│             reviewService.ts, reportService.ts, (plus announcement/resource/assignment/message/
│             notification/userService as needed)
├── context/ AuthContext.tsx
├── hooks/
├── routes/ AppRoutes.tsx, ProtectedRoute.tsx, RoleRoute.tsx
├── types/  (TypeScript interfaces for ALL API models)
├── mocks/  (see §17)
├── utils/ validators.ts, constants.ts, formatters.ts
├── App.tsx
└── main.tsx
```

**Rules:** no business logic inside shared visual components; no raw Axios calls inside pages — all endpoint paths, request building and response mapping live in `services/`. Use TypeScript interfaces/types for every API model.

---

## 5. Application shell & navigation

All authenticated pages use one **DashboardLayout** = **Sidebar + Topbar + main content**. It must be responsive and **never duplicated per role**.

### 5.1 Sidebar (role-aware)
| Role | Navigation items |
|---|---|
| Student | Overview; My Group; My Project; Submissions; Feedback; Notifications; Settings — **plus** Announcements, Resources, Assignments |
| Teacher | Overview; My Students; Groups; Projects; Submissions; Evaluations; Reports; Settings — **plus** Announcements, Resources, Assignments |
| Admin | Overview; Users; Teachers; Students; Departments; Groups; Projects; Submissions; Reports; Settings |

- **Desktop:** fixed/sticky sidebar, active route clearly highlighted (primary colour).
- **Tablet:** collapses to icons.
- **Mobile:** opens as a **drawer** from a menu button (or bottom navigation).
- Menu visibility is role-aware, but **backend authorization is the real security boundary**.

### 5.2 Topbar
Current page title **or** breadcrumb; optional contextual search; notification access (bell with unread count); profile avatar; profile menu (Profile, Settings, Logout). Same height and placement for every role.

### 5.3 Main content
Consistent page container: page heading, optional description, **primary action aligned right**, responsive grid content area. **Tables** for dense admin records, **cards** for student-facing summaries.

---

## 6. Pages — detailed low-level design

### 6.1 Authentication module
**Login:** brand area; email; password with show/hide toggle; forgot-password link; submit button; registration/help link. Flow: validate required fields → call auth service → loading + error handling → establish session → redirect to the dashboard for the **authenticated role**. Never trust a browser-supplied role.

**Register:** full name, email, password, confirm password, **roll/enrollment number**, **department**, **academic year**; also (idea doc) **course/branch**, **year/semester**, and optional **college/university name**. Student-only (see §0). Email must be unique (show server 409 error inline). If arriving from an invitation link, preserve the invite code and continue to join after authentication.

**Forgot Password:** email field, success message that does not reveal whether the email exists.

**Invite Join page `/join/:inviteCode`:** public preview (`GET /api/invite/{code}`) showing group name, description, teacher, member count. If not logged in → prompt to log in/register, then return to this page. Then **Join Group** (`POST /api/invite/{code}/join`). Handle states: invalid code, expired invitation, group inactive/disabled, already a member (friendly message + go to group).

### 6.2 Student dashboard (highest design attention)
Components: **WelcomeHeader** (greeting + next-step message), **QuickStats** (2–4 cards, e.g. active project, pending submission), **ActiveProjectCard** (title, group, status, deadline, details action), **ProgressBar** (milestone-derived), **UpcomingDeadline** (next due dates), **RecentActivity** (feedback, uploads, group updates), **TeamMembers** (compact members + teacher), **QuickActions** (View Project, Upload Submission, View Feedback — immediately accessible).

**Layout:** greeting + supporting text on top → compact row of 2–4 stat cards → wide active-project card beside an upcoming-deadlines panel → team members and recent activity. On mobile stack in priority order.

Also show (idea doc): "My Groups" list (group name, teacher name, member count) and "My Project Groups" (subgroup name, members), with actions: Open Group, Open My Subgroup, Create Subgroup, Leave Group, View Announcements, View Resources, Submit Assignments.

### 6.3 Group management
**Student "My Group" page:** group name and identifier, assigned teacher, members, project title, group status. Main-group view also shows description, creator name, member count, announcements, resources, **only the student's own subgroups**, and **Leave Group** (ConfirmDialog; explain access to that group's resources/announcements/subgroups will be removed; if the student created a subgroup, show the rule/notice from the backend). A student must **never** see other students' subgroups or profiles — only render what the API returns, and handle 403/404 gracefully.

**Teacher group management:** group creation, student search + multi-select, optional group leader selection, project assignment, editing, student reassignment. Teacher also: create **main academic group** (name, description) and receive the invite link `/join/{inviteCode}` with Copy button, regenerate/disable if supported; view members (name, email, roll number); view **all subgroups** in the main group (name, member count, creator).

**Create Group modal fields:** group name; searchable student selector; selected-student **chips + count**; optional group leader; project selection; **Cancel**; **Create Group**. Inline validation; prevent duplicate submissions while saving (disable + loading state).

**Create Subgroup (student):** subgroup name, description, add members **by email** (autocomplete from parent-group members is allowed only if the API provides it). Enforce **max 3 members including the creator** in the UI (show "2 of 3 slots used"), and show backend errors if a user is not in the parent group. Member removal with ConfirmDialog.

**Subgroup Details (teacher view):** subgroup name, members (names, emails, roll numbers), member count, creator, resources, links, submission status, **Message option** (send a message to only this subgroup), **Send reminder** (when pending/late), Export Excel for this subgroup. **Subgroup Details (student view):** own subgroup only — members, resources, messages received from the teacher, submission status.

### 6.4 Project management
**Project list:** reusable **ProjectCard**: title, short description, group, teacher, status, progress, deadline, **View Details**.
**Project details page** sections: overview, requirements, team members, **milestones**, submission history, teacher feedback.
**Milestones:** clear label, due date (if applicable), state = **Not started / In progress / Submitted / Approved**. Progress is calculated from the milestone/task model (done milestones ÷ total), never an arbitrary score.

### 6.5 Project submission (critical workflow)
Identify project and group **first**, then collect: project title, project details/description, **GitHub repository URL**, **project file**, **synopsis**, optional other links. A checklist makes missing requirements obvious.

| Component | Responsibility |
|---|---|
| SubmissionHeader | Project, group and submission context (and assignment name/deadline) |
| GithubInput | Repository URL with basic URL validation (https GitHub URL) |
| FileUpload | Drag-and-drop or browse, file details, progress, retry, removal |
| SynopsisUpload | Synopsis document upload with accepted types (e.g. PDF/DOC/DOCX) |
| DescriptionInput | Short project summary |
| SubmissionChecklist | Shows which required fields are complete |
| SubmitButton | Submits after client validation **and** confirmation |

Provide **Save Draft** and **Submit Project** (Save Draft only if the API supports drafts — hide otherwise via a feature flag). Before final submission show a **ConfirmDialog** saying it will be sent for review. After success show confirmation, **submission reference/status**, and the **next step**.

**Submission updates:** students may edit the submission (GitHub link, project file, synopsis, links) until the assignment is **locked**; show "Locked by teacher" and disable editing when locked; show a clear "last updated" timestamp; optionally list **submission history** (previous versions) if the API returns it. Late submissions show a "Late" label, not alarm styling.

### 6.6 Teacher submission review
**Submissions list:** group, project, submitter, submission date, status, **Review** action. **Teacher submission dashboard** (idea doc): for the selected main group show Total Students, Total Project Groups, and counts of **Submitted / Pending / Late**, plus **[ Export Excel ]**. **Filters:** group, subgroup, student, roll number, submission status, assignment, submission date (range). Filters live in **URL search parameters** (shareable). After filters are applied show **[ Export Filtered Excel ]** that exports only the filtered records (pass the same params to the export endpoint).

**Detail page `/teacher/submissions/:id`:** project description, repository link, synopsis preview/download, project file download, members (name, email, roll no.), submission date/status, **feedback form**, review history.

**Review actions:** **Approved**, **Revision Required**, **Rejected** (subject to backend workflow). **Feedback is required** for Revision Required and Rejected (validate). Also: **Send Reminder** to a subgroup when pending/late (opens MessageBox prefilled but editable). Display review history where available.

### 6.7 Admin dashboard & management
**Dashboard:** system totals — students, teachers, groups, projects, pending submissions, approved projects. Add department summaries and recent activity **only** where they help the admin act (Recharts, simple charts).
**Management pages** (Users, Teachers, Students, Departments, Groups, Projects, Submissions, Reports): reusable **searchable, sortable, paginated tables** with filters, row actions, confirmation dialogs, and empty/loading/error states. Create/edit forms in Modals. Users page can create Teacher/Admin accounts or send an invitation (this is where privileged roles are assigned).

### 6.8 Excel export
UI: an **Export Excel** button and filter controls — **academic year, department, teacher, group, subgroup, submission status, assignment, date range**. The frontend only calls the endpoint and downloads the returned `.xlsx` (use `responseType: 'blob'`, filename from `Content-Disposition`, show loading state + success/error toast). The backend generates the workbook.

Export scopes (each a button/menu item): **Entire main group**, **Individual subgroup**, **Assignment-wise**, **Filtered view**.
Endpoints: `GET /api/groups/{groupId}/export/excel`, `GET /api/subgroups/{subgroupId}/export/excel`, `GET /api/assignments/{assignmentId}/export/excel`, plus the LLD's `GET /api/reports/export` (filters as query params, e.g. `?status=PENDING`, `?subgroupId=12`).

For reference, the workbook columns (do not generate in the frontend; show them in a "What's included" preview/tooltip on the export panel): S.No., Group Name, Student Name, Email ID, Roll Number, Project Name/Title, GitHub Repository/Link, Project File (clickable "Open Project File" reference), Synopsis ("Open Synopsis"), Other Link, Submission Status, Submission Date, Teacher Remarks. Group projects repeat the project info per member row. File columns hold **stable download/reference links**, never embedded content.

### 6.9 Announcements & messaging (from idea doc)
- **Announcements** (`/…/announcements`): teacher can post to the whole main group (title + content, with a note "Students will also be notified by email"); all members see a feed of **AnnouncementCard**s (title, author, date). Students have **no** create control.
- **Messages:** teacher sends a message directly to a specific subgroup via **MessageBox** (only that subgroup's members are notified). Students see messages addressed to their subgroup (read-only). Empty states for none.

### 6.10 Resources (from idea doc)
**ResourceCard**: title, description, URL/file URL, shared-by, group/subgroup, created date. Types: GitHub links, Google Drive links, documentation, project guidelines, useful websites, PDF/document files, other URLs (show a type icon + label). Teachers and authorised students can add (link **or** file upload); delete only own/owned (ConfirmDialog). Show only what the API returns for the user's groups.

### 6.11 Assignments (from idea doc)
**AssignmentCard**: title, description, deadline, status (open / due soon / closed / locked). Teacher: create assignment (title, description, deadline date-time; validate deadline is in the future client-side), lock/unlock, view submissions per assignment, **Export assignment Excel**. Student: list assignments for their group, open to submit as their subgroup. Teacher's per-assignment table shows each project group with **Submitted / Pending / Late** (text + colour) as in the example list.

### 6.12 Profile, Notifications, Settings
- **Profile:** full name, email (read-only), roll number, college/university (optional), course/branch, year/semester; edit with validation; change password.
- **Notifications:** list from server, unread badge in Topbar, mark as read.
- **Settings:** basic preferences (e.g. email notification toggle, reduced motion respected automatically).

### 6.13 Error / utility pages
**Unauthorized (403)** page, **Not Found (404)** page, **Server error** state, **Offline/network** state.

---

## 7. Reusable component catalogue (all required)

| Component | Responsibility / behaviour |
|---|---|
| Button | Variants **primary, secondary, outline, danger**; loading + disabled states; focus-visible ring; icon support; consistent size scale; accessible name |
| Input | Label, helper text, validation message, disabled state; `aria-describedby` for errors |
| Select | Single **or multi** select with accessible keyboard interaction |
| Modal | Reusable dialog shell: title, body, actions, **focus trap**, Escape closes when safe, returns focus |
| Badge | Text-labelled status indicator — **never colour alone** |
| Loader / Skeleton | Loading feedback that **preserves layout** (no layout jump) |
| EmptyState | Helpful explanation + relevant next action |
| ConfirmDialog / ConfirmationDialog | Confirm destructive/irreversible actions |
| FileUpload | Select, **type/size checks**, upload progress, retry, removal |
| StatCard | Label, value, optional trend/context |
| DataTable | Sorting, filtering, pagination, responsive overflow (scroll or card-per-row on mobile) |
| PageHeader | Title, description, breadcrumbs, action slot |
| StatusPill / SubmissionStatus | Consistent display of workflow state |
| Navbar / Sidebar / Topbar | Per §5 |
| GroupCard, MemberList, AnnouncementCard, MessageBox, ResourceCard, AssignmentCard | Per §6 |
| ProjectCard, ProgressBar, MilestoneList | Per §6.4 |

Reference Button (extend it — add focus-visible styles, icon support, sizes, `type` prop, `aria-busy` while loading):
```tsx
function Button({ children, variant = "primary", loading = false, disabled = false, onClick }) {
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-slate-100 text-slate-700",
    danger: "bg-red-600 text-white",
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading}
            className={`px-4 py-2 rounded-lg ${styles[variant]}`}>
      {loading ? "Please wait..." : children}
    </button>
  );
}
```

---

## 8. Routing & access control

| Route | Access |
|---|---|
| `/login` | Public |
| `/register` | Public (or invitation-based) |
| `/forgot-password` | Public |
| `/join/:inviteCode` | Public preview; join requires login (idea doc) |
| `/student/dashboard`, `/student/group`, `/student/project`, `/student/submission`, `/student/feedback` | Student |
| `/teacher/dashboard`, `/teacher/groups`, `/teacher/projects`, `/teacher/submissions`, `/teacher/submissions/:id` | Teacher |
| `/admin/dashboard`, `/admin/users`, `/admin/teachers`, `/admin/students`, `/admin/departments`, `/admin/reports` | Admin |

Also create (with matching role guards): `/student|teacher/groups/:groupId`, `…/subgroups/:subgroupId`, `…/announcements`, `…/resources`, `…/assignments`, `…/assignments/:id`, `/student/notifications`, `/*/profile`, `/*/settings`, teacher `/teacher/students`, `/teacher/evaluations`, `/teacher/reports`, admin `/admin/groups`, `/admin/projects`, `/admin/submissions`, `/admin/settings`, `/unauthorized`, and `*` (404). `/` redirects to the role's dashboard (or login).

### Protected route flow (implement exactly)
```
Open route → Authenticated?
   No  → redirect to Login (remember the intended URL, return after login)
   Yes → check required role
           mismatch → show Unauthorized page
           match    → render requested page
```
Implement with `ProtectedRoute` (auth) and `RoleRoute` (role). Frontend guards improve UX only — they do **not** secure data; every protected API call is authorised by the backend.

---

## 9. State & data management

| State | Approach |
|---|---|
| Authenticated user & role | `AuthContext` |
| Form values & validation | React Hook Form + Zod |
| Modal visibility | Local component state |
| Upload progress | Local state or an upload hook |
| Server lists & details | TanStack Query (consistent query-key conventions, cache invalidation after mutations) |
| Notifications | Server query + lightweight context if needed |
| Filters & pagination | **URL search parameters** (shareable) |

### 9.1 Auth state shape (illustrative only — not a trusted source of authorization)
```ts
const authState = {
  user: { id: 101, name: "Student Name", email: "student@example.com", role: "STUDENT" },
  isAuthenticated: true,
  isLoading: false,
};
```
Derive the user from the backend session/validated token (e.g. `GET /api/auth/me` on app load). **Do not store credentials or long-lived bearer tokens in localStorage.**

### 9.2 Request/response flow
`React Page → Feature Component → Service function → Shared Axios client → Spring Boot REST API ← Response/Error → Update query cache or local UI state → Render updated screen.`

### 9.3 Status model (use these everywhere via one `StatusPill` mapping)
Submission: `DRAFT`, `PENDING`, `SUBMITTED`, `LATE`, `UNDER_REVIEW`, `APPROVED`, `REVISION_REQUIRED`, `REJECTED`. Milestone: `NOT_STARTED`, `IN_PROGRESS`, `SUBMITTED`, `APPROVED`. Colour mapping: Approved/Completed = Success; Upcoming/Revision needed/Late = Warning; Rejected/Error = Error; Submitted/Informational = Information; Pending/Not started = neutral grey. **Always show the text label.**

---

## 10. API integration contract

Single shared Axios instance in `services/api.ts` (`baseURL` from `VITE_API_BASE_URL`, `withCredentials`, request/response interceptors: 401 → try refresh once then redirect to login; map errors to a typed `ApiError`). Keep endpoint paths, request construction and response mapping **only** in service modules. Use pagination params (`page`, `size`) on list endpoints. Treat these as editable defaults — centralise them in `services/endpoints.ts` so they can be changed in one place.

**LLD endpoints**
| Service | Endpoint | Purpose |
|---|---|---|
| Auth | `POST /api/auth/login` | Authenticate |
| Auth | `POST /api/auth/register` | Register eligible user |
| Groups | `GET /api/groups/my-group` | Student's group |
| Groups | `POST /api/groups` | Teacher creates group |
| Projects | `GET /api/projects` | List accessible projects |
| Projects | `GET /api/projects/{id}` | Project details |
| Submissions | `POST /api/submissions` | Submit project |
| Submissions | `GET /api/submissions` | List submissions |
| Reviews | `POST /api/reviews` | Submit teacher review |
| Reports | `GET /api/reports/export` | Request Excel export |

**Idea-doc endpoints**
- Auth: `POST /api/auth/refresh`
- Groups: `GET /api/groups`, `GET|PUT|DELETE /api/groups/{id}`, `POST /api/groups/{id}/join`, `POST /api/groups/{id}/leave`
- Invitations: `POST /api/groups/{id}/invite`, `GET /api/invite/{code}`, `POST /api/invite/{code}/join`
- Subgroups: `POST|GET /api/groups/{id}/subgroups`, `GET /api/subgroups/{id}`, `POST /api/subgroups/{id}/members`, `DELETE /api/subgroups/{id}/members/{userId}`
- Announcements: `POST|GET /api/groups/{id}/announcements`
- Messages: `POST|GET /api/groups/{id}/messages` (target subgroup)
- Resources: `POST|GET /api/groups/{id}/resources`, `DELETE /api/resources/{id}`
- Assignments: `POST|GET /api/groups/{id}/assignments`, `GET /api/assignments/{id}`
- Submissions: `POST|GET /api/assignments/{id}/submissions` (also `PUT` to update until locked)
- Export: `GET /api/groups/{groupId}/export/excel`, `GET /api/subgroups/{subgroupId}/export/excel`, `GET /api/assignments/{assignmentId}/export/excel` (+ filter query params)

### 10.1 Error handling (implement all)
| Status | Frontend behaviour |
|---|---|
| 400 | Field-level or request validation errors |
| 401 | Expired/invalid session → return to sign-in when appropriate |
| 403 | Access-denied page or message |
| 404 | Not-found state |
| 409 | Conflict message (duplicate email, already a member, subgroup full) |
| 500 | Safe server-error message + retry where appropriate |
| Network failure | Explain service is unreachable; allow retry |

Never display raw stack traces or sensitive server error details. **Preserve user-entered form values when a recoverable request fails.**

---

## 11. Responsive design (mobile-first Tailwind)
| Viewport | Layout |
|---|---|
| Desktop ≥1024 px | Full sidebar, multi-column dashboard, wide tables |
| Tablet 768–1023 px | Collapsible (icon) sidebar, fewer grid columns, compact tables |
| Mobile <768 px | Drawer or bottom navigation, stacked cards, full-width forms, responsive dialogs |

Tables may scroll horizontally or become record cards. File selection, modal actions and primary buttons must be easy with touch (min ~44 px targets).

---

## 12. Interaction, feedback & accessibility
| Interaction | Behaviour |
|---|---|
| Button hover/focus | Subtle colour transition + visible keyboard focus |
| Card hover | Small elevation change **only when interactive** |
| Page navigation | Short, non-distracting transition |
| Modal | Focus trapped while open; Escape closes when safe |
| File upload | Show progress, success, failure, retry |
| Loading | Skeletons/inline spinners, no layout jumps |
| Success | Clear confirmation + resulting status |
| Reduced motion | Respect `prefers-reduced-motion` (disable Framer Motion transitions) |

**Required UI states:** every data-driven page supports **loading, success, empty, error**. Examples: "No projects assigned yet" (+ helpful explanation); "Project submitted successfully" (+ current status); "Unable to upload file" (+ reason + retry).

Also use: confirmation dialogs, toast notifications, inline form validation, responsive navigation, pagination where required.

**Accessibility checklist:** semantic headings and buttons; programmatically associated labels; sufficient text contrast (WCAG AA); keyboard-accessible controls; visible focus states; descriptive link text; alt text for meaningful images; accessible error announcements (`role="alert"`/`aria-live`); never communicate status by colour alone; skip-to-content link.

---

## 13. Frontend security & validation
- Validate forms client-side (Zod) for fast feedback; the backend remains authoritative.
- Files: check **extension, MIME type (where available) and size** on the client (e.g. max 10–25 MB, configurable in `constants.ts`); the server validates independently.
- Use HTTPS in production; HttpOnly cookies + CSRF handling; **no secrets** in `VITE_*` env vars or bundles.
- Render user-generated text safely; **never** use `dangerouslySetInnerHTML` with user content; sanitise/validate URLs (allow only `http/https`; add `rel="noopener noreferrer"` to external links).
- **Clear user-specific cached data (TanStack Query cache, context) on logout.**
- Never rely only on frontend restrictions (hiding a button is not security).

### Validation rules to encode in Zod schemas
Email format; password strength (min 8, mixed); confirm-password match; required full name / roll number / department / academic year; GitHub URL pattern; subgroup max 3 members; no duplicate member emails; group name required (min length); assignment deadline in the future; review feedback required when status is Revision Required or Rejected; file type/size limits.

---

## 14. Business rules the UI must respect (backend enforces; UI reflects)
1. Email unique. 2. No joining the same group twice. 3. Subgroup max 3 students. 4. Subgroup creator and members must belong to the parent group. 5. Students cannot access unrelated subgroups. 6. Only the owning teacher manages a main group. 7. Teachers can message the whole group and individual subgroups. 8. Students cannot post teacher-only announcements. 9. Students can leave groups. 10. Disabled/deleted groups don't accept new members. 11. Invitation codes are unique/valid/non-expired. 12. Users only see authorised resources. 13. Assignment deadlines are validated by the backend. 14. Excel export only for the owning teacher (hide button otherwise; handle 403).

---

## 15. Dashboards (summary of required content)
**Teacher dashboard:** "My Groups" cards (name, members, subgroups count); actions: Create Group, Open Group, Send Announcement, View Members, View Subgroups, Create Assignment, View Submissions, Share Resources; submission summary (Total Students, Total Project Groups, Submitted/Pending/Late) with Export Excel.
**Student dashboard:** see §6.2.
**Admin dashboard:** see §6.7.

---

## 16. Development plan (build in this order, one phase at a time)
| Phase | Work | Priority |
|---|---|---|
| 1 | Vite + React + TS app, Tailwind setup, routing, ESLint/Prettier, folder structure | High |
| 2 | Design tokens + reusable common components | High |
| 3 | Authentication + protected/role routes + invite join | High |
| 4 | Student, teacher, admin dashboard shells (DashboardLayout) | High |
| 5 | Group management screens (main groups, subgroups, invite link) | High |
| 6 | Project list + project details (milestones/progress) | High |
| 7 | Submission form + file upload experience (+ update/lock) | High |
| 8 | Teacher review + feedback (+ reminders) | High |
| 9 | Announcements, messages, resources, assignments | High |
| 10 | Admin management + Excel export controls | Medium |
| 11 | Responsive refinements, accessibility, animation polish | High |
| 12 | Integration, regression and usability testing | High |

Build and validate the **student journey early**: login → view group → open project → submit synopsis and project files → view submission status → read teacher feedback. Then implement teacher and admin workflows around the same shared components. Start with the design system and shell, then auth, the student dashboard, project details, and submission workflow.

---

## 17. Mock API layer & running the app
- Provide a **mock mode** (`VITE_USE_MOCKS=true`) using **MSW** (Mock Service Worker) or an Axios adapter, with realistic seed data: 1 admin, 2 teachers, ~12 students (with roll numbers like `21CSE001`), 2 main groups, ~5 subgroups (≤3 members), projects with milestones, assignments (one open, one locked), submissions in every status, announcements, resources, notifications. Include demo logins (e.g. `student@example.com`, `teacher@example.com`, `admin@example.com`, shown on the login page in mock mode only).
- Mock the Excel export by returning a small blob so the download flow can be tested.
- Mocks must respect the authorization rules in §14 (e.g. a student requesting another subgroup gets 403).
- `.env.example` with `VITE_API_BASE_URL`, `VITE_USE_MOCKS`.
- README: install, run (`npm install`, `npm run dev`), build, lint, env vars, folder structure, assumptions you made, how to switch from mocks to the real backend.

---

## 18. Acceptance criteria (the build must satisfy all)
- [ ] Separate dashboards and navigation exist for Admin, Teacher and Student.
- [ ] Role-aware routes and menus behave correctly (including Unauthorized and 404 pages).
- [ ] All forms show clear validation messages.
- [ ] Teacher can create groups and select students through the UI.
- [ ] Students can view their assigned group and project.
- [ ] Students can join a main group via invite link and create a subgroup (max 3), seeing only their own subgroups.
- [ ] Students can enter a GitHub URL and upload required files (project file + synopsis).
- [ ] File upload shows progress, errors and retry behaviour.
- [ ] Submission status is visible and understandable (text + colour); submissions can be updated until locked.
- [ ] Teachers can review submissions and provide feedback (feedback required for revision/rejection) and send reminders.
- [ ] Teacher can post announcements, message a subgroup, share resources, and create assignments.
- [ ] Admin can manage records and trigger report export; teacher can export main group / subgroup / assignment / filtered Excel.
- [ ] All data-driven pages handle loading, empty, success and error states.
- [ ] Layouts work at desktop, tablet and mobile widths.
- [ ] Keyboard navigation, focus states and accessible labels are in place; reduced motion respected.
- [ ] Frontend route checks are documented as backed by server-side authorization.
- [ ] No tokens/credentials in localStorage; user data cleared on logout.

---

## 19. Final design recommendation
Use a **modern SaaS + academic productivity** aesthetic: combine the simplicity and whitespace of productivity tools, the consistency of project-management interfaces, and the positive reinforcement of learning apps — **without copying any one product**. Give the **student dashboard the most design attention**; keep **View Project, Upload Submission, View Feedback** immediately accessible. Use progress tracking and milestones to encourage momentum while keeping the experience **calm and non-competitive**.

## 20. Output instructions
1. First print a short plan and the final folder tree.
2. Then generate the code phase by phase (§16), complete files only — no placeholders, no "TODO", no omitted pages.
3. Ensure `npm install && npm run dev` works with mocks and the project type-checks and lints cleanly.
4. End with the README content and a checklist mapping each acceptance criterion in §18 to the files that satisfy it.
