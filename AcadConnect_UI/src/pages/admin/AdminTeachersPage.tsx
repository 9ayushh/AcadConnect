import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { User } from '../../types';
import { GraduationCap, Mail, Building2 } from 'lucide-react';

export const AdminTeachersPage: React.FC = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => userService.getUsers(),
  });

  const teachers = (users || []).filter((u) => u.role === 'TEACHER');

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Faculty Name',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900">{u.name}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              {u.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      sortable: true,
      render: (u) => (
        <span className="text-xs text-slate-700 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          {u.department}
        </span>
      ),
    },
    {
      key: 'collegeName',
      header: 'Affiliation',
      render: (u) => (
        <span className="text-xs text-slate-500">
          {u.collegeName || 'National Institute of Technology'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty & Teachers Directory"
        description="Oversee appointed course instructors, project guides, and evaluation panels"
      />

      <DataTable
        columns={columns}
        data={teachers}
        loading={isLoading}
        searchKey="name"
        searchPlaceholder="Search faculty guides..."
      />
    </div>
  );
};
