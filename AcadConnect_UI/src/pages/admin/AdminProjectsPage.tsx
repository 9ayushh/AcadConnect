import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../../services/projectService';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusPill } from '../../components/common/StatusPill';
import { ProgressBar } from '../../components/dashboard/ProgressBar';
import { Project } from '../../types';
import { formatDate } from '../../utils/formatters';

export const AdminProjectsPage: React.FC = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['adminProjects'],
    queryFn: () => projectService.getProjects(),
  });

  const columns: Column<Project>[] = [
    {
      key: 'title',
      header: 'Project Title',
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-bold text-slate-900">{p.title}</p>
          <p className="text-xs text-slate-500">{p.mainGroupName || 'Academic Capstone'}</p>
        </div>
      ),
    },
    {
      key: 'teacherName',
      header: 'Assigned Guide',
      sortable: true,
      render: (p) => <span className="text-xs text-slate-800">{p.teacherName}</span>,
    },
    {
      key: 'progress',
      header: 'Milestone Progress',
      sortable: true,
      render: (p) => (
        <div className="w-32">
          <ProgressBar progress={p.progress} size="sm" />
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (p) => <StatusPill status={p.status} size="sm" />,
    },
    {
      key: 'deadline',
      header: 'Deadline',
      render: (p) => <span className="text-xs text-slate-500">{formatDate(p.deadline)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution Projects Oversight"
        description="Audit student milestone progress and faculty approvals across all academic tracks"
      />

      <DataTable
        columns={columns}
        data={projects || []}
        loading={isLoading}
        searchKey="title"
        searchPlaceholder="Search projects..."
      />
    </div>
  );
};
