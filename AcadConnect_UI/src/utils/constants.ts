export const APP_NAME = "AcadConnect";

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const ALLOWED_PROJECT_EXTENSIONS = ['.zip', '.tar.gz', '.rar', '.pdf', '.docx', '.txt'];
export const ALLOWED_SYNOPSIS_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export const SUBGROUP_MAX_MEMBERS = 3;

export const STATUS_COLORS = {
  // Submission Statuses
  DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
  PENDING: 'bg-slate-100 text-slate-700 border-slate-200',
  SUBMITTED: 'bg-blue-50 text-blue-700 border-blue-200',
  UNDER_REVIEW: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REVISION_REQUIRED: 'bg-amber-50 text-amber-700 border-amber-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  LATE: 'bg-amber-50 text-amber-700 border-amber-200',

  // Milestone Statuses
  NOT_STARTED: 'bg-slate-100 text-slate-700 border-slate-200',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
} as const;

export const STATUS_LABELS = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REVISION_REQUIRED: 'Revision Required',
  REJECTED: 'Rejected',
  LATE: 'Late',
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  OPEN: 'Open',
  DUE_SOON: 'Due Soon',
  CLOSED: 'Closed',
  LOCKED: 'Locked',
} as const;

export const DEMO_USERS = [
  { role: 'STUDENT', email: 'student@example.com', password: 'password123', label: 'Student (Aarav Sharma)' },
  { role: 'TEACHER', email: 'teacher@example.com', password: 'password123', label: 'Teacher (Dr. Rajesh Kumar)' },
  { role: 'ADMIN', email: 'admin@example.com', password: 'password123', label: 'Admin (System Administrator)' },
];
