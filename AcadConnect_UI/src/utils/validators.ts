import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  rollNumber: z.string().min(2, 'Roll/Enrollment number is required'),
  department: z.string().min(2, 'Department is required'),
  academicYear: z.string().min(4, 'Academic year is required (e.g. 2026-2027)'),
  course: z.string().min(2, 'Course/Branch is required (e.g. B.Tech CSE)'),
  yearSemester: z.string().min(2, 'Year/Semester is required (e.g. 4th Year / Sem 7)'),
  collegeName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const createMainGroupSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export type CreateMainGroupFormData = z.infer<typeof createMainGroupSchema>;

export const createSubgroupSchema = z.object({
  name: z.string().min(2, 'Subgroup name must be at least 2 characters'),
  description: z.string().optional(),
  memberEmail1: z.string().email('Invalid email').optional().or(z.literal('')),
  memberEmail2: z.string().email('Invalid email').optional().or(z.literal('')),
}).refine(
  (data) => {
    if (data.memberEmail1 && data.memberEmail2 && data.memberEmail1.toLowerCase() === data.memberEmail2.toLowerCase()) {
      return false;
    }
    return true;
  },
  {
    message: 'Member emails cannot be identical',
    path: ['memberEmail2'],
  }
);

export type CreateSubgroupFormData = z.infer<typeof createSubgroupSchema>;

export const submissionSchema = z.object({
  title: z.string().min(3, 'Project title is required'),
  description: z.string().min(10, 'Please provide a detailed description (at least 10 chars)'),
  githubUrl: z
    .string()
    .url('Please enter a valid URL')
    .regex(/^https:\/\/github\.com\/[\w-]+\/[\w.-]+/, 'Must be a valid GitHub repository URL (https://github.com/owner/repo)'),
  otherLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;

export const reviewSchema = z.object({
  status: z.enum(['APPROVED', 'REVISION_REQUIRED', 'REJECTED']),
  remarks: z.string(),
}).refine(
  (data) => {
    if ((data.status === 'REVISION_REQUIRED' || data.status === 'REJECTED') && (!data.remarks || data.remarks.trim().length < 5)) {
      return false;
    }
    return true;
  },
  {
    message: 'Remarks / feedback are required when requesting revision or rejecting',
    path: ['remarks'],
  }
);

export type ReviewFormData = z.infer<typeof reviewSchema>;

export const createAssignmentSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  deadline: z.string().refine((val) => {
    const d = new Date(val);
    return !isNaN(d.getTime()) && d > new Date();
  }, {
    message: 'Deadline must be a valid future date and time',
  }),
});

export type CreateAssignmentFormData = z.infer<typeof createAssignmentSchema>;

export const createAnnouncementSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

export type CreateAnnouncementFormData = z.infer<typeof createAnnouncementSchema>;

export const createResourceSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['GITHUB', 'DRIVE', 'DOCUMENTATION', 'GUIDELINES', 'WEBSITE', 'PDF', 'OTHER']),
  url: z.string().url('Please enter a valid URL'),
});

export type CreateResourceFormData = z.infer<typeof createResourceSchema>;
