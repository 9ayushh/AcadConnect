import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { groupService } from '../../services/groupService';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { MainGroup } from '../../types';
import { formatDate } from '../../utils/formatters';

export const AdminGroupsPage: React.FC = () => {
  const { data: groups, isLoading } = useQuery({
    queryKey: ['adminGroups'],
    queryFn: () => groupService.getAllGroups(),
  });

  const columns: Column<MainGroup>[] = [
    {
      key: 'name',
      header: 'Group Name',
      sortable: true,
      render: (g) => (
        <div>
          <p className="font-bold text-slate-900">{g.name}</p>
          <p className="text-xs text-slate-500 line-clamp-1">{g.description}</p>
        </div>
      ),
    },
    {
      key: 'teacherName',
      header: 'Faculty Guide',
      sortable: true,
      render: (g) => <span className="text-xs font-semibold text-slate-800">{g.teacherName}</span>,
    },
    {
      key: 'inviteCode',
      header: 'Invite Code',
      render: (g) => (
        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {g.inviteCode}
        </span>
      ),
    },
    {
      key: 'memberCount',
      header: 'Members',
      sortable: true,
      render: (g) => <span className="text-xs text-slate-700">{g.memberCount} enrolled</span>,
    },
    {
      key: 'createdAt',
      header: 'Created Date',
      render: (g) => <span className="text-xs text-slate-400">{formatDate(g.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institution-wide Academic Groups"
        description="Comprehensive audit of all project divisions and course clusters"
      />

      <DataTable
        columns={columns}
        data={groups || []}
        loading={isLoading}
        searchKey="name"
        searchPlaceholder="Filter groups..."
      />
    </div>
  );
};
