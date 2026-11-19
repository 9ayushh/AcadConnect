import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import {
  initialUsers,
  initialGroups,
  initialSubgroups,
  initialProjects,
  initialSubmissions,
  initialAssignments,
  initialAnnouncements,
  initialMessages,
  initialResources,
  initialNotifications,
} from './mockData';
import { User, Submission, MainGroup, Subgroup, Assignment, Announcement, Resource, SubgroupMessage } from '../types';

// In-memory working copies
let users: User[] = [...initialUsers];
let groups: MainGroup[] = [...initialGroups];
let subgroups: Subgroup[] = [...initialSubgroups];
let projects = [...initialProjects];
let submissions: Submission[] = [...initialSubmissions];
let assignments: Assignment[] = [...initialAssignments];
let announcements: Announcement[] = [...initialAnnouncements];
let messages: SubgroupMessage[] = [...initialMessages];
let resources: Resource[] = [...initialResources];
let notifications = [...initialNotifications];

let currentSessionUser: User | null = users[3]; // Default to student Aarav Sharma on first run

export function setMockSessionUser(user: User | null) {
  currentSessionUser = user;
}

export function getMockSessionUser(): User | null {
  return currentSessionUser;
}

export function setupMockAdapter(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    // If not using mocks, pass through to network
    if (import.meta.env.VITE_USE_MOCKS !== 'true') {
      return config;
    }

    const method = (config.method || 'get').toLowerCase();
    const url = (config.url || '').replace(/^[a-z]+:\/\/[^/]+/i, '').replace(/^\/api/, '');
    const data = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});

    // Custom response adapter bypass
    config.adapter = async () => {
      // Small simulated latency (150ms)
      await new Promise((r) => setTimeout(r, 120));

      const authUser = currentSessionUser;

      // 1. Auth routes
      if (url === '/auth/login' && method === 'post') {
        const found = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
        if (found) {
          currentSessionUser = found;
          return {
            data: { user: found, token: 'mock-jwt-token-' + found.id },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          };
        }
        throw { response: { status: 401, data: { message: 'Invalid email or password' } } };
      }

      if (url === '/auth/register' && method === 'post') {
        const exists = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
        if (exists) {
          throw { response: { status: 409, data: { message: 'An account with this email already exists' } } };
        }
        // Public registration creates a STUDENT account only
        const newUser: User = {
          id: 'user-student-' + (users.length + 1),
          name: data.name,
          email: data.email,
          role: 'STUDENT',
          rollNumber: data.rollNumber,
          department: data.department,
          academicYear: data.academicYear,
          course: data.course,
          yearSemester: data.yearSemester,
          collegeName: data.collegeName || 'National Institute of Technology',
          createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        currentSessionUser = newUser;
        return {
          data: { user: newUser, token: 'mock-jwt-token-' + newUser.id },
          status: 201,
          statusText: 'Created',
          headers: {},
          config,
        };
      }

      if (url === '/auth/me' && method === 'get') {
        if (!authUser) {
          throw { response: { status: 401, data: { message: 'Not authenticated' } } };
        }
        return { data: { user: authUser }, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (url === '/auth/logout' && method === 'post') {
        currentSessionUser = null;
        return { data: { message: 'Logged out successfully' }, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (url === '/auth/refresh' && method === 'post') {
        return { data: { user: authUser, token: 'mock-jwt-refreshed' }, status: 200, statusText: 'OK', headers: {}, config };
      }

      // 2. Groups
      if (url === '/groups/my-group' && method === 'get') {
        if (!authUser) throw { response: { status: 401, data: { message: 'Unauthorized' } } };
        if (authUser.role === 'STUDENT') {
          // Find subgroup student belongs to
          const mySub = subgroups.find((s) => s.members.some((m) => m.userId === authUser.id));
          const myGroup = groups.find((g) => g.id === mySub?.mainGroupId) || groups[0];
          return {
            data: {
              mainGroup: myGroup,
              subgroup: mySub || null,
              allMySubgroups: subgroups.filter((s) => s.members.some((m) => m.userId === authUser.id)),
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          };
        }
        return { data: { mainGroup: groups[0], subgroup: null }, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (url === '/groups' && method === 'get') {
        if (authUser?.role === 'TEACHER') {
          const teacherGroups = groups.filter((g) => g.teacherId === authUser.id);
          return { data: teacherGroups, status: 200, statusText: 'OK', headers: {}, config };
        }
        return { data: groups, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (url === '/groups' && method === 'post') {
        if (authUser?.role !== 'TEACHER' && authUser?.role !== 'ADMIN') {
          throw { response: { status: 403, data: { message: 'Only teachers can create main groups' } } };
        }
        const newGroup: MainGroup = {
          id: 'group-' + (groups.length + 1),
          name: data.name,
          description: data.description,
          teacherId: authUser.id,
          teacherName: authUser.name,
          inviteCode: data.name.toUpperCase().replace(/\s+/g, '-').slice(0, 10) + '-' + Math.floor(100 + Math.random() * 900),
          isActive: true,
          memberCount: 0,
          subgroupCount: 0,
          createdAt: new Date().toISOString(),
        };
        groups.unshift(newGroup);
        return { data: newGroup, status: 201, statusText: 'Created', headers: {}, config };
      }

      // Invite Preview: /invite/{code}
      const inviteMatch = url.match(/^\/invite\/([^/]+)$/);
      if (inviteMatch && method === 'get') {
        const code = inviteMatch[1];
        const group = groups.find((g) => g.inviteCode === code);
        if (!group) {
          throw { response: { status: 404, data: { message: 'Invalid or expired invitation code' } } };
        }
        return { data: group, status: 200, statusText: 'OK', headers: {}, config };
      }

      // Invite Join: /invite/{code}/join
      const inviteJoinMatch = url.match(/^\/invite\/([^/]+)\/join$/);
      if (inviteJoinMatch && method === 'post') {
        if (!authUser) throw { response: { status: 401, data: { message: 'Must be logged in to join' } } };
        const code = inviteJoinMatch[1];
        const group = groups.find((g) => g.inviteCode === code);
        if (!group) throw { response: { status: 404, data: { message: 'Invalid code' } } };
        group.memberCount += 1;
        return { data: { message: 'Successfully joined group', group }, status: 200, statusText: 'OK', headers: {}, config };
      }

      // Subgroups for group: /groups/{groupId}/subgroups
      const groupSubgroupsMatch = url.match(/^\/groups\/([^/]+)\/subgroups$/);
      if (groupSubgroupsMatch && method === 'get') {
        const groupId = groupSubgroupsMatch[1];
        let res = subgroups.filter((s) => s.mainGroupId === groupId);
        // Student rule: only see their own subgroup (§6.3, §14)
        if (authUser?.role === 'STUDENT') {
          res = res.filter((s) => s.members.some((m) => m.userId === authUser.id));
        }
        return { data: res, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (groupSubgroupsMatch && method === 'post') {
        const groupId = groupSubgroupsMatch[1];
        if (!authUser) throw { response: { status: 401, data: { message: 'Unauthorized' } } };

        // Max 3 members check
        const memberEmails: string[] = [authUser.email];
        if (data.memberEmail1?.trim()) memberEmails.push(data.memberEmail1.trim());
        if (data.memberEmail2?.trim()) memberEmails.push(data.memberEmail2.trim());

        if (memberEmails.length > 3) {
          throw { response: { status: 400, data: { message: 'Maximum 3 students permitted per subgroup' } } };
        }

        const membersList = memberEmails.map((email, idx) => {
          const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
          return {
            id: 'mem-' + Date.now() + '-' + idx,
            userId: found?.id || 'guest-' + idx,
            name: found?.name || email.split('@')[0],
            email: email,
            rollNumber: found?.rollNumber || `21CSE0${10 + idx}`,
            department: found?.department || 'CSE',
            joinedAt: new Date().toISOString(),
          };
        });

        const newSubgroup: Subgroup = {
          id: 'subgroup-' + (subgroups.length + 1),
          mainGroupId: groupId,
          name: data.name,
          description: data.description || '',
          creatorId: authUser.id,
          creatorName: authUser.name,
          members: membersList,
          submissionStatus: 'PENDING',
          createdAt: new Date().toISOString(),
        };

        subgroups.unshift(newSubgroup);
        const parent = groups.find((g) => g.id === groupId);
        if (parent) parent.subgroupCount += 1;

        return { data: newSubgroup, status: 201, statusText: 'Created', headers: {}, config };
      }

      // Subgroup details: /subgroups/{id}
      const singleSubgroupMatch = url.match(/^\/subgroups\/([^/]+)$/);
      if (singleSubgroupMatch && method === 'get') {
        const subId = singleSubgroupMatch[1];
        const sub = subgroups.find((s) => s.id === subId);
        if (!sub) throw { response: { status: 404, data: { message: 'Subgroup not found' } } };
        // Student privacy guard (§14): only allowed to see own subgroup
        if (authUser?.role === 'STUDENT' && !sub.members.some((m) => m.userId === authUser.id)) {
          throw { response: { status: 403, data: { message: 'You do not have permission to view other subgroups' } } };
        }
        return { data: sub, status: 200, statusText: 'OK', headers: {}, config };
      }

      // Leave group: /groups/{id}/leave
      const groupLeaveMatch = url.match(/^\/groups\/([^/]+)\/leave$/);
      if (groupLeaveMatch && method === 'post') {
        if (!authUser) throw { response: { status: 401, data: { message: 'Unauthorized' } } };
        // Remove student from any subgroup
        subgroups = subgroups.map((s) => ({
          ...s,
          members: s.members.filter((m) => m.userId !== authUser.id),
        }));
        return { data: { message: 'Successfully left the group' }, status: 200, statusText: 'OK', headers: {}, config };
      }

      // 3. Projects
      if (url === '/projects' && method === 'get') {
        let res = [...projects];
        if (authUser?.role === 'STUDENT') {
          // Return student's active project
          const mySub = subgroups.find((s) => s.members.some((m) => m.userId === authUser.id));
          res = projects.filter((p) => p.subgroupId === mySub?.id || p.id === mySub?.assignedProjectId);
        }
        return { data: res, status: 200, statusText: 'OK', headers: {}, config };
      }

      const singleProjectMatch = url.match(/^\/projects\/([^/]+)$/);
      if (singleProjectMatch && method === 'get') {
        const pId = singleProjectMatch[1];
        const p = projects.find((item) => item.id === pId) || projects[0];
        return { data: p, status: 200, statusText: 'OK', headers: {}, config };
      }

      // 4. Submissions
      if (url === '/submissions' && method === 'get') {
        let res = [...submissions];
        if (authUser?.role === 'STUDENT') {
          const mySub = subgroups.find((s) => s.members.some((m) => m.userId === authUser.id));
          res = submissions.filter((s) => s.subgroupId === mySub?.id);
        }
        return { data: res, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (url === '/submissions' && method === 'post') {
        if (!authUser) throw { response: { status: 401, data: { message: 'Unauthorized' } } };
        const mySub = subgroups.find((s) => s.members.some((m) => m.userId === authUser.id)) || subgroups[0];
        const newSubmission: Submission = {
          id: 'sub-' + (submissions.length + 1),
          projectId: data.projectId || 'project-1',
          projectTitle: data.title || 'Distributed Health Record AI Orchestrator',
          subgroupId: mySub.id,
          subgroupName: mySub.name,
          githubUrl: data.githubUrl,
          projectFileUrl: data.projectFileUrl || '/mock-files/project_submission.zip',
          projectFileName: data.projectFileName || 'project_submission.zip',
          synopsisUrl: data.synopsisUrl || '/mock-files/synopsis.pdf',
          synopsisFileName: data.synopsisFileName || 'synopsis.pdf',
          otherLink: data.otherLink || '',
          description: data.description,
          status: 'SUBMITTED',
          submittedAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
          isLocked: false,
          members: mySub.members,
        };

        // Update subgroup status as well
        mySub.submissionStatus = 'SUBMITTED';

        submissions.unshift(newSubmission);
        return { data: newSubmission, status: 201, statusText: 'Created', headers: {}, config };
      }

      const singleSubMatch = url.match(/^\/submissions\/([^/]+)$/);
      if (singleSubMatch && method === 'get') {
        const sId = singleSubMatch[1];
        const found = submissions.find((s) => s.id === sId) || submissions[0];
        return { data: found, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (singleSubMatch && method === 'put') {
        const sId = singleSubMatch[1];
        const sub = submissions.find((s) => s.id === sId);
        if (!sub) throw { response: { status: 404, data: { message: 'Submission not found' } } };
        if (sub.isLocked) {
          throw { response: { status: 403, data: { message: 'This submission has been locked by the teacher' } } };
        }
        Object.assign(sub, {
          ...data,
          lastUpdatedAt: new Date().toISOString(),
        });
        return { data: sub, status: 200, statusText: 'OK', headers: {}, config };
      }

      // 5. Reviews
      if (url === '/reviews' && method === 'post') {
        if (authUser?.role !== 'TEACHER' && authUser?.role !== 'ADMIN') {
          throw { response: { status: 403, data: { message: 'Only teachers can evaluate submissions' } } };
        }
        const { submissionId, status, remarks } = data;
        const target = submissions.find((s) => s.id === submissionId);
        if (target) {
          target.status = status;
          target.teacherRemarks = remarks;
          if (!target.reviewHistory) target.reviewHistory = [];
          target.reviewHistory.unshift({
            id: 'rev-' + Date.now(),
            status,
            remarks,
            reviewerId: authUser.id,
            reviewerName: authUser.name,
            createdAt: new Date().toISOString(),
          });

          // Also reflect in subgroup
          const subG = subgroups.find((sg) => sg.id === target.subgroupId);
          if (subG) subG.submissionStatus = status;

          // Push a notification to student
          notifications.unshift({
            id: 'notif-' + Date.now(),
            userId: target.members?.[0]?.userId || 'user-student-1',
            title: `Submission status: ${status}`,
            message: `${authUser.name} marked your submission as ${status}: ${remarks}`,
            type: 'REVIEW',
            isRead: false,
            link: '/student/feedback',
            createdAt: new Date().toISOString(),
          });
        }
        return { data: { message: 'Review recorded successfully' }, status: 200, statusText: 'OK', headers: {}, config };
      }

      if (url === '/reviews/send-reminder' && method === 'post') {
        const { subgroupId, message } = data;
        messages.unshift({
          id: 'msg-' + Date.now(),
          mainGroupId: 'group-1',
          subgroupId: subgroupId,
          subgroupName: 'Target Subgroup',
          senderId: authUser?.id || 'user-teacher-1',
          senderName: authUser?.name || 'Dr. Rajesh Kumar',
          content: message || 'Reminder: Your assignment submission is pending/due soon.',
          createdAt: new Date().toISOString(),
        });
        return { data: { message: 'Reminder sent to subgroup' }, status: 200, statusText: 'OK', headers: {}, config };
      }

      // 6. Announcements
      const annMatch = url.match(/^\/groups\/([^/]+)\/announcements$/);
      if (annMatch && method === 'get') {
        const groupId = annMatch[1];
        return { data: announcements.filter((a) => a.mainGroupId === groupId || !a.mainGroupId), status: 200, statusText: 'OK', headers: {}, config };
      }
      if (annMatch && method === 'post') {
        if (authUser?.role !== 'TEACHER' && authUser?.role !== 'ADMIN') {
          throw { response: { status: 403, data: { message: 'Students cannot post teacher announcements' } } };
        }
        const groupId = annMatch[1];
        const newAnn: Announcement = {
          id: 'ann-' + (announcements.length + 1),
          mainGroupId: groupId,
          title: data.title,
          content: data.content,
          authorId: authUser.id,
          authorName: authUser.name,
          createdAt: new Date().toISOString(),
        };
        announcements.unshift(newAnn);
        return { data: newAnn, status: 201, statusText: 'Created', headers: {}, config };
      }

      // 7. Messages
      const msgMatch = url.match(/^\/groups\/([^/]+)\/messages$/);
      if (msgMatch && method === 'get') {
        const groupId = msgMatch[1];
        let res = messages.filter((m) => m.mainGroupId === groupId);
        if (authUser?.role === 'STUDENT') {
          const mySub = subgroups.find((s) => s.members.some((mem) => mem.userId === authUser.id));
          res = res.filter((m) => m.subgroupId === mySub?.id);
        }
        return { data: res, status: 200, statusText: 'OK', headers: {}, config };
      }
      if (msgMatch && method === 'post') {
        const groupId = msgMatch[1];
        const newMsg: SubgroupMessage = {
          id: 'msg-' + (messages.length + 1),
          mainGroupId: groupId,
          subgroupId: data.subgroupId,
          subgroupName: data.subgroupName || 'Subgroup',
          senderId: authUser?.id || 'teacher',
          senderName: authUser?.name || 'Teacher',
          content: data.content,
          createdAt: new Date().toISOString(),
        };
        messages.unshift(newMsg);
        return { data: newMsg, status: 201, statusText: 'Created', headers: {}, config };
      }

      // 8. Resources
      const resMatch = url.match(/^\/groups\/([^/]+)\/resources$/);
      if (resMatch && method === 'get') {
        const groupId = resMatch[1];
        return { data: resources.filter((r) => r.mainGroupId === groupId), status: 200, statusText: 'OK', headers: {}, config };
      }
      if (resMatch && method === 'post') {
        const groupId = resMatch[1];
        const newRes: Resource = {
          id: 'res-' + (resources.length + 1),
          mainGroupId: groupId,
          title: data.title,
          description: data.description,
          type: data.type,
          url: data.url,
          sharedById: authUser?.id || 'teacher',
          sharedByName: authUser?.name || 'Teacher',
          createdAt: new Date().toISOString(),
        };
        resources.unshift(newRes);
        return { data: newRes, status: 201, statusText: 'Created', headers: {}, config };
      }

      // Delete resource: /resources/{id}
      const delResMatch = url.match(/^\/resources\/([^/]+)$/);
      if (delResMatch && method === 'delete') {
        const id = delResMatch[1];
        resources = resources.filter((r) => r.id !== id);
        return { data: { message: 'Resource removed' }, status: 200, statusText: 'OK', headers: {}, config };
      }

      // 9. Assignments
      const assignMatch = url.match(/^\/groups\/([^/]+)\/assignments$/);
      if (assignMatch && method === 'get') {
        const groupId = assignMatch[1];
        return { data: assignments.filter((a) => a.mainGroupId === groupId), status: 200, statusText: 'OK', headers: {}, config };
      }
      if (assignMatch && method === 'post') {
        if (authUser?.role !== 'TEACHER' && authUser?.role !== 'ADMIN') {
          throw { response: { status: 403, data: { message: 'Only teachers can create assignments' } } };
        }
        const groupId = assignMatch[1];
        const newAssign: Assignment = {
          id: 'assign-' + (assignments.length + 1),
          mainGroupId: groupId,
          title: data.title,
          description: data.description,
          deadline: data.deadline,
          isLocked: false,
          status: 'OPEN',
          totalGroups: subgroups.filter((s) => s.mainGroupId === groupId).length,
          submittedCount: 0,
          pendingCount: subgroups.filter((s) => s.mainGroupId === groupId).length,
          lateCount: 0,
          createdAt: new Date().toISOString(),
        };
        assignments.unshift(newAssign);
        return { data: newAssign, status: 201, statusText: 'Created', headers: {}, config };
      }

      // Lock toggle: /assignments/{id}/lock
      const lockAssignMatch = url.match(/^\/assignments\/([^/]+)\/lock$/);
      if (lockAssignMatch && method === 'put') {
        const id = lockAssignMatch[1];
        const item = assignments.find((a) => a.id === id);
        if (item) {
          item.isLocked = !item.isLocked;
          item.status = item.isLocked ? 'LOCKED' : 'OPEN';
        }
        return { data: item, status: 200, statusText: 'OK', headers: {}, config };
      }

      // 10. Notifications
      if (url === '/notifications' && method === 'get') {
        const userNotifs = notifications.filter((n) => n.userId === authUser?.id || authUser?.role === 'TEACHER');
        return { data: userNotifs, status: 200, statusText: 'OK', headers: {}, config };
      }
      const notifReadMatch = url.match(/^\/notifications\/([^/]+)\/read$/);
      if (notifReadMatch && method === 'post') {
        const nId = notifReadMatch[1];
        const notif = notifications.find((n) => n.id === nId);
        if (notif) notif.isRead = true;
        return { data: { message: 'Marked read' }, status: 200, statusText: 'OK', headers: {}, config };
      }

      // 11. Excel Export (Mock returning a generated CSV/Spreadsheet Blob)
      if (url.includes('/export') || url.includes('/excel')) {
        // Generate valid CSV rows representing Excel export (§6.8)
        const csvHeader = [
          'S.No.',
          'Group Name',
          'Student Name',
          'Email ID',
          'Roll Number',
          'Project Title',
          'GitHub Repository',
          'Project File Link',
          'Synopsis Link',
          'Submission Status',
          'Submission Date',
          'Teacher Remarks',
        ].join(',');

        const rows = submissions.map((sub, index) => {
          const student = sub.members?.[0] || { name: 'Aarav Sharma', email: 'student@example.com', rollNumber: '21CSE001' };
          return [
            index + 1,
            `"${sub.subgroupName}"`,
            `"${student.name}"`,
            `"${student.email}"`,
            `"${student.rollNumber}"`,
            `"${sub.projectTitle}"`,
            `"${sub.githubUrl}"`,
            `"${sub.projectFileName || 'download.zip'}"`,
            `"${sub.synopsisFileName || 'synopsis.pdf'}"`,
            `"${sub.status}"`,
            `"${sub.submittedAt || ''}"`,
            `"${sub.teacherRemarks || 'None'}"`,
          ].join(',');
        });

        const csvContent = [csvHeader, ...rows].join('\n');
        const blob = new Blob([csvContent], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        return {
          data: blob,
          status: 200,
          statusText: 'OK',
          headers: {
            'content-disposition': 'attachment; filename="AcadConnect_Submissions_Export.xlsx"',
            'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          config,
        };
      }

      // 12. Admin Users
      if (url === '/admin/users' && method === 'get') {
        return { data: users, status: 200, statusText: 'OK', headers: {}, config };
      }
      if (url === '/admin/users' && method === 'post') {
        const newUser: User = {
          id: 'user-' + (users.length + 1),
          name: data.name,
          email: data.email,
          role: data.role || 'STUDENT',
          department: data.department,
          rollNumber: data.rollNumber,
          createdAt: new Date().toISOString(),
        };
        users.unshift(newUser);
        return { data: newUser, status: 201, statusText: 'Created', headers: {}, config };
      }

      // Default fallback
      return { data: {}, status: 200, statusText: 'OK', headers: {}, config };
    };

    return config;
  });
}
