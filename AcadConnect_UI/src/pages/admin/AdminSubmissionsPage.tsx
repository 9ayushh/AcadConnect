import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { submissionService } from '../../services/submissionService';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusPill } from '../../components/common/StatusPill';
import { Submission } from '../../types';
import { formatDate } from '../../utils/formatters';

export const AdminSubmissionsPage: React.FC = () => {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['adminSubmissions'],
    queryFn: () => submissionService.getSubmissions(),
  });

  const columns: Column<Submission>[] = [
    {
      key: 'subgroupName',
      header: 'Subgroup',
      sortable: true,
      render: (s) => (
        <div>
          <p className="font-bold text-slate-900">{s.subgroupName}</p>
          <p className="text-xs text-slate-500">{s.projectTitle}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Submission Status',
      sortable: true,
      render: (s) => <StatusPill status={s.status} size="sm" />,
    },
    {
      key: 'githubUrl',
      header: 'GitHub Link',
      render: (s) => (
        <a
          href={s.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-600 hover:underline truncate max-w-xs block"
        >
          {s.githubUrl}
        </a>
      ),
    },
    {
      key: 'submittedAt',
      header: 'Date',
      sortable: true,
      render: (s) => <span className="text-xs text-slate-500">{formatDate(s.submittedAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution Submissions Ledger"
        description="Global record of student repository submissions, project files, and review states"
      />

      <DataTable
        columns={columns}
        data={submissions || []}
        loading={isLoading}
        searchKey="subgroupName"
        searchPlaceholder="Filter submissions..."
      />
    </div>
  );
};
