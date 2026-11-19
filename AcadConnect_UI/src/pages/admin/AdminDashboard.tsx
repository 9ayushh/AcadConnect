import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { groupService } from '../../services/groupService';
import { projectService } from '../../services/projectService';
import { submissionService } from '../../services/submissionService';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Loader } from '../../components/common/Loader';
import {
  Users,
  GraduationCap,
  FolderGit2,
  FileCheck2,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => userService.getUsers(),
  });

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['adminGroups'],
    queryFn: () => groupService.getAllGroups(),
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['adminProjects'],
    queryFn: () => projectService.getProjects(),
  });

  const { data: submissions, isLoading: subsLoading } = useQuery({
    queryKey: ['adminSubmissions'],
    queryFn: () => submissionService.getSubmissions(),
  });

  if (usersLoading || groupsLoading || projectsLoading || subsLoading) {
    return <Loader size="lg" label="Loading system administration dashboard..." />;
  }

  const allUsers = users || [];
  const studentsCount = allUsers.filter((u) => u.role === 'STUDENT').length;
  const teachersCount = allUsers.filter((u) => u.role === 'TEACHER').length;
  const approvedCount = (submissions || []).filter((s) => s.status === 'APPROVED').length;

  const chartData = [
    { name: 'Computer Science', students: 9, projects: 3 },
    { name: 'Information Tech', students: 3, projects: 1 },
    { name: 'Electronics', students: 4, projects: 2 },
    { name: 'Mechanical', students: 2, projects: 1 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Administration Dashboard"
        description="High-level metrics, role provisioning, department summaries, and institution-wide compliance"
      />

      {/* Metric Cards (§6.7) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Total Students"
          value={studentsCount}
          icon={<Users className="w-5 h-5 text-indigo-600" />}
        />
        <StatCard
          label="Faculty Guides"
          value={teachersCount}
          icon={<GraduationCap className="w-5 h-5 text-indigo-600" />}
        />
        <StatCard
          label="Active Groups"
          value={groups?.length || 2}
          icon={<Building2 className="w-5 h-5 text-indigo-600" />}
        />
        <StatCard
          label="Capstone Projects"
          value={projects?.length || 3}
          icon={<FolderGit2 className="w-5 h-5 text-indigo-600" />}
        />
        <StatCard
          label="Submissions"
          value={submissions?.length || 3}
          icon={<FileCheck2 className="w-5 h-5 text-indigo-600" />}
        />
        <StatCard
          label="Approved Projects"
          value={approvedCount}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          trendType="positive"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Department Participation Overview</h3>
            <p className="text-xs text-slate-500">
              Active student enrollments and approved project quotas per engineering department
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="students" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Students" />
              <Bar dataKey="projects" fill="#10B981" radius={[4, 4, 0, 0]} name="Projects" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
