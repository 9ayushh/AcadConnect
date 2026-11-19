import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { submissionService } from '../../services/submissionService';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusPill } from '../../components/common/StatusPill';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';
import { Submission } from '../../types';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

export const TeacherEvaluationsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => submissionService.getSubmissions(),
  });

  const columns: Column<Submission>[] = [
    {
      key: 'subgroupName',
      header: 'Subgroup',
      sortable: true,
      render: (item) => <span className="font-bold text-slate-900">{item.subgroupName}</span>,
    },
    {
      key: 'projectTitle',
      header: 'Project Title',
      render: (item) => (
        <span className="font-medium text-slate-800 line-clamp-1">{item.projectTitle}</span>
      ),
    },
    {
      key: 'status',
      header: 'Evaluation Status',
      sortable: true,
      render: (item) => <StatusPill status={item.status} size="sm" />,
    },
    {
      key: 'teacherRemarks',
      header: 'Remarks Recorded',
      render: (item) => (
        <span className="text-xs text-slate-500 italic line-clamp-1">
          {item.teacherRemarks || 'Awaiting review remarks'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      render: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/teacher/submissions/${item.id}`)}
          icon={<ExternalLink className="w-3.5 h-3.5 text-indigo-600" />}
        >
          View dossier
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Evaluations & Grading"
        description="Review grading status, comments, and approved deliverables across project groups"
      />

      <DataTable
        columns={columns}
        data={submissions || []}
        loading={isLoading}
        searchKey="subgroupName"
        searchPlaceholder="Filter evaluation records..."
      />
    </div>
  );
};
