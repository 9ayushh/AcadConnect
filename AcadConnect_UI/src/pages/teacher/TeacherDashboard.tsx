import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { groupService } from '../../services/groupService';
import { submissionService } from '../../services/submissionService';
import { reportService } from '../../services/reportService';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { GroupCard } from '../../components/group/GroupCard';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  FolderGit2,
  FileCheck2,
  Clock,
  Plus,
  FileSpreadsheet,
  Megaphone,
  CheckSquare,
  BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['teacherGroups'],
    queryFn: () => groupService.getAllGroups(),
  });

  const { data: submissions, isLoading: subsLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => submissionService.getSubmissions(),
  });

  const handleExportExcel = async () => {
    try {
      await reportService.exportGroupExcel(groups?.[0]?.id || 'group-1');
      toast.success('Spreadsheet downloaded successfully!');
    } catch {
      toast.error('Failed to export Excel report');
    }
  };

  if (groupsLoading || subsLoading) {
    return <Loader size="lg" label="Loading teacher dashboard..." />;
  }

  const allSubs = submissions || [];
  const submittedCount = allSubs.filter(
    (s) => s.status === 'SUBMITTED' || s.status === 'APPROVED' || s.status === 'UNDER_REVIEW'
  ).length;
  const pendingCount = allSubs.filter((s) => s.status === 'PENDING').length;
  const lateCount = allSubs.filter((s) => s.status === 'LATE').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Instructor Project Portal"
        description="Oversee academic groups, track milestone deliverables, and evaluate student subgroups"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              icon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
            >
              Export Excel
            </Button>
            <Link to="/teacher/groups">
              <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
                Create Group
              </Button>
            </Link>
          </div>
        }
      />

      {/* Submission Rate Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={groups?.reduce((acc, g) => acc + g.memberCount, 0) || 12}
          description="Enrolled in your sections"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          label="Submitted Deliverables"
          value={submittedCount}
          description="Ready for evaluation"
          icon={<FileCheck2 className="w-5 h-5 text-emerald-600" />}
          trendType="positive"
        />
        <StatCard
          label="Pending Submissions"
          value={pendingCount}
          description="Awaiting student uploads"
          icon={<Clock className="w-5 h-5 text-slate-500" />}
        />
        <StatCard
          label="Late / Overdue"
          value={lateCount}
          description="Exceeded scheduled deadline"
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          trendType="negative"
        />
      </div>

      {/* Instructor Quick Actions per §15 */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Instructor Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={() => navigate('/teacher/groups')}
            className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-center transition-all flex flex-col items-center"
          >
            <Users className="w-5 h-5 text-indigo-600 mb-1" />
            <span className="text-xs font-semibold text-slate-800">Manage Groups</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher/submissions')}
            className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-center transition-all flex flex-col items-center"
          >
            <FileCheck2 className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-xs font-semibold text-slate-800">Submissions</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher/announcements')}
            className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-center transition-all flex flex-col items-center"
          >
            <Megaphone className="w-5 h-5 text-amber-600 mb-1" />
            <span className="text-xs font-semibold text-slate-800">Post Notice</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher/assignments')}
            className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-center transition-all flex flex-col items-center"
          >
            <CheckSquare className="w-5 h-5 text-blue-600 mb-1" />
            <span className="text-xs font-semibold text-slate-800">Assignments</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher/resources')}
            className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-center transition-all flex flex-col items-center"
          >
            <BookOpen className="w-5 h-5 text-purple-600 mb-1" />
            <span className="text-xs font-semibold text-slate-800">Share Resources</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher/reports')}
            className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-center transition-all flex flex-col items-center"
          >
            <FileSpreadsheet className="w-5 h-5 text-teal-600 mb-1" />
            <span className="text-xs font-semibold text-slate-800">Excel Reports</span>
          </button>
        </div>
      </div>

      {/* Main Groups List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">My Main Academic Groups</h3>
          <Link
            to="/teacher/groups"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View all groups →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups?.map((g) => (
            <GroupCard
              key={g.id}
              group={g}
              onOpen={() => navigate(`/teacher/groups`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
