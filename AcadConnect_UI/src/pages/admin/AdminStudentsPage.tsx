import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { User } from '../../types';
import { Mail, Hash } from 'lucide-react';

export const AdminStudentsPage: React.FC = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => userService.getUsers(),
  });

  const students = (users || []).filter((u) => u.role === 'STUDENT');

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Student Name',
      sortable: true,
      render: (u) => (
        <div>
          <p className="font-bold text-slate-900">{u.name}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400" />
            {u.email}
          </p>
        </div>
      ),
    },
    {
      key: 'rollNumber',
      header: 'Roll Number',
      sortable: true,
      render: (u) => (
        <span className="font-mono text-xs font-semibold text-slate-700 flex items-center gap-1">
          <Hash className="w-3.5 h-3.5 text-slate-400" />
          {u.rollNumber}
        </span>
      ),
    },
    {
      key: 'course',
      header: 'Course / Branch',
      render: (u) => <span className="text-xs text-slate-700">{u.course || u.department}</span>,
    },
    {
      key: 'yearSemester',
      header: 'Year / Semester',
      render: (u) => <span className="text-xs text-slate-500">{u.yearSemester || '4th Year'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Registration Roster"
        description="Verify enrollment records, student credentials, and academic year statuses"
      />

      <DataTable
        columns={columns}
        data={students}
        loading={isLoading}
        searchKey="name"
        searchPlaceholder="Search students..."
      />
    </div>
  );
};
