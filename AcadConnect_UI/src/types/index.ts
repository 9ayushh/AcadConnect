export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  rollNumber?: string;
  department?: string;
  academicYear?: string;
  course?: string;
  yearSemester?: string;
  collegeName?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export type SubmissionStatusType =
  | 'DRAFT'
  | 'PENDING'
  | 'SUBMITTED'
  | 'LATE'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REVISION_REQUIRED'
  | 'REJECTED';

export type MilestoneStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'APPROVED';

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: MilestoneStatus;
  order: number;
}

export interface MainGroup {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  teacherName: string;
  inviteCode: string;
  inviteUrl?: string;
  isActive: boolean;
  memberCount: number;
  subgroupCount: number;
  createdAt: string;
}

export interface SubgroupMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  rollNumber: string;
  department?: string;
  joinedAt: string;
}

export interface Subgroup {
  id: string;
  mainGroupId: string;
  name: string;
  description?: string;
  creatorId: string;
  creatorName: string;
  members: SubgroupMember[];
  assignedProjectId?: string;
  projectTitle?: string;
  submissionStatus: SubmissionStatusType;
  lastUpdated?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  requirements?: string[];
  teacherId: string;
  teacherName: string;
  mainGroupId: string;
  mainGroupName?: string;
  subgroupId?: string;
  subgroupName?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  progress: number; // 0-100 derived from milestones
  deadline: string;
  milestones: Milestone[];
  createdAt: string;
}

export interface ReviewHistoryEntry {
  id: string;
  status: SubmissionStatusType;
  remarks: string;
  reviewerId: string;
  reviewerName: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  projectId: string;
  projectTitle: string;
  subgroupId: string;
  subgroupName: string;
  assignmentId?: string;
  assignmentTitle?: string;
  githubUrl: string;
  projectFileUrl?: string;
  projectFileName?: string;
  synopsisUrl?: string;
  synopsisFileName?: string;
  otherLink?: string;
  description: string;
  status: SubmissionStatusType;
  submittedAt?: string;
  lastUpdatedAt?: string;
  isLocked: boolean;
  teacherRemarks?: string;
  reviewHistory?: ReviewHistoryEntry[];
  members?: SubgroupMember[];
}

export interface Announcement {
  id: string;
  mainGroupId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface SubgroupMessage {
  id: string;
  mainGroupId: string;
  subgroupId: string;
  subgroupName: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  mainGroupId: string;
  subgroupId?: string;
  title: string;
  description?: string;
  type: 'GITHUB' | 'DRIVE' | 'DOCUMENTATION' | 'GUIDELINES' | 'WEBSITE' | 'PDF' | 'OTHER';
  url: string;
  sharedById: string;
  sharedByName: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  mainGroupId: string;
  title: string;
  description: string;
  deadline: string;
  isLocked: boolean;
  status: 'OPEN' | 'DUE_SOON' | 'CLOSED' | 'LOCKED';
  totalGroups: number;
  submittedCount: number;
  pendingCount: number;
  lateCount: number;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SUBMISSION' | 'REVIEW' | 'ANNOUNCEMENT' | 'ASSIGNMENT' | 'REMINDER';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string>;
}

export interface FilterParams {
  academicYear?: string;
  department?: string;
  teacherId?: string;
  groupId?: string;
  subgroupId?: string;
  status?: SubmissionStatusType;
  assignmentId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}
