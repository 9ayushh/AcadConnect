import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { submissionService } from '../../services/submissionService';
import { reportService } from '../../services/reportService';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusPill } from '../../components/common/StatusPill';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';
import { Submission, SubmissionStatusType } from '../../types';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FileSpreadsheet, ExternalLink, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export const TeacherSubmissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatusFilter = searchParams.get('status') || 'ALL';

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => submissionService.getSubmissions(),
  });

  const handleStatusFilterChange = (status: string) => {
    if (status === 'ALL') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
  };

  const handleExportFiltered = async () => {
    try {
      await reportService.exportFilteredReports({
        status: currentStatusFilter !== 'ALL' ? (currentStatusFilter as SubmissionStatusType) : undefined,
      });
      toast.success('Filtered submissions spreadsheet exported successfully!');
    } catch {
      toast.error('Failed to export Excel spreadsheet');
    }
  };

  const allSubs = submissions || [];
  const filteredSubs =
    currentStatusFilter === 'ALL'
      ? allSubs
      : allSubs.filter((s) => s.status === currentStatusFilter);

  const columns: Column<Submission>[] = [
    {
      key: 'subgroupName',
      header: 'Subgroup',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-bold text-slate-900">{item.subgroupName}</p>
          <p className="text-xs text-slate-500">{item.assignmentTitle || 'Milestone Review'}</p>
        </div>
      ),
    },
    {
      key: 'projectTitle',
      header: 'Project Title',
      sortable: true,
      render: (item) => (
        <span className="font-medium text-slate-800 line-clamp-1 max-w-xs">{item.projectTitle}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => <StatusPill status={item.status} size="sm" />,
    },
    {
      key: 'submittedAt',
      header: 'Submitted',
      sortable: true,
      render: (item) => (
        <span className="text-xs text-slate-500">
          {formatDate(item.submittedAt || item.lastUpdatedAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Review',
      render: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/teacher/submissions/${item.id}`)}
          icon={<ExternalLink className="w-3.5 h-3.5 text-indigo-600" />}
        >
          Evaluate
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Deliverable Submissions"
        description="Evaluate subgroup repositories, verify code and synopses, and provide grading feedback"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportFiltered}
              icon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
            >
              Export Filtered Excel
            </Button>
          </div>
        }
      />

      {/* URL-bound Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Filter by Status:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: 'All', value: 'ALL' },
              { label: 'Submitted', value: 'SUBMITTED' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Revision Required', value: 'REVISION_REQUIRED' },
              { label: 'Late', value: 'LATE' },
            ].map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => handleStatusFilterChange(f.value)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  currentStatusFilter === f.value
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredSubs.length} submissions
        </span>
      </div>

      {/* Submissions DataTable */}
      <DataTable
        columns={columns}
        data={filteredSubs}
        loading={isLoading}
        searchKey="subgroupName"
        searchPlaceholder="Search by subgroup or project name..."
      />
    </div>
  );
};
