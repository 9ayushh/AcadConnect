export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  // Groups
  GROUPS: '/groups',
  MY_GROUP: '/groups/my-group',
  GROUP_BY_ID: (id: string) => `/groups/${id}`,
  GROUP_JOIN: (id: string) => `/groups/${id}/join`,
  GROUP_LEAVE: (id: string) => `/groups/${id}/leave`,
  GROUP_INVITE: (id: string) => `/groups/${id}/invite`,
  INVITE_PREVIEW: (code: string) => `/invite/${code}`,
  INVITE_JOIN: (code: string) => `/invite/${code}/join`,

  // Subgroups
  GROUP_SUBGROUPS: (groupId: string) => `/groups/${groupId}/subgroups`,
  SUBGROUP_BY_ID: (id: string) => `/subgroups/${id}`,
  SUBGROUP_MEMBERS: (id: string) => `/subgroups/${id}/members`,
  SUBGROUP_MEMBER_REMOVE: (id: string, userId: string) => `/subgroups/${id}/members/${userId}`,

  // Projects
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id: string) => `/projects/${id}`,

  // Submissions
  SUBMISSIONS: '/submissions',
  SUBMISSION_BY_ID: (id: string) => `/submissions/${id}`,
  ASSIGNMENT_SUBMISSIONS: (assignmentId: string) => `/assignments/${assignmentId}/submissions`,

  // Reviews
  REVIEWS: '/reviews',
  SEND_REMINDER: '/reviews/send-reminder',

  // Communication
  ANNOUNCEMENTS: (groupId: string) => `/groups/${groupId}/announcements`,
  MESSAGES: (groupId: string) => `/groups/${groupId}/messages`,
  RESOURCES: (groupId: string) => `/groups/${groupId}/resources`,
  RESOURCE_BY_ID: (id: string) => `/resources/${id}`,

  // Assignments
  ASSIGNMENTS: (groupId: string) => `/groups/${groupId}/assignments`,
  ASSIGNMENT_BY_ID: (id: string) => `/assignments/${id}`,
  ASSIGNMENT_TOGGLE_LOCK: (id: string) => `/assignments/${id}/lock`,

  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_MARK_READ: (id: string) => `/notifications/${id}/read`,

  // Reports / Excel Export
  EXPORT_REPORTS: '/reports/export',
  EXPORT_GROUP_EXCEL: (groupId: string) => `/groups/${groupId}/export/excel`,
  EXPORT_SUBGROUP_EXCEL: (subgroupId: string) => `/subgroups/${subgroupId}/export/excel`,
  EXPORT_ASSIGNMENT_EXCEL: (assignmentId: string) => `/assignments/${assignmentId}/export/excel`,

  // Admin / Users
  USERS: '/admin/users',
  USER_BY_ID: (id: string) => `/admin/users/${id}`,
  DEPARTMENTS: '/admin/departments',
};
