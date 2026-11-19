import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable, Column } from '../../components/common/DataTable';
import { User } from '../../types';
import { Mail, Hash, Building2 } from 'lucide-react';

export const TeacherStudentsPage: React.FC = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => userService.getUsers(),
  });

  const students = (users || []).filter((u) => u.role === 'STUDENT');

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Student Name',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
            {item.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" />
              {item.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'rollNumber',
      header: 'Roll Number',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs text-slate-700 flex items-center gap-1">
          <Hash className="w-3.5 h-3.5 text-slate-400" />
          {item.rollNumber || '—'}
        </span>
      ),
    },
    {
      key: 'department',
      header: 'Department / Branch',
      sortable: true,
      render: (item) => (
        <span className="text-xs text-slate-600 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          {item.course || item.department || 'Computer Science'}
        </span>
      ),
    },
    {
      key: 'academicYear',
      header: 'Academic Year',
      render: (item) => (
        <span className="text-xs text-slate-500">{item.academicYear || '2026-2027'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Roster & Directory"
        description="Comprehensive list of enrolled students across your supervised academic sections"
      />

      <DataTable
        columns={columns}
        data={students}
        loading={isLoading}
        searchKey="name"
        searchPlaceholder="Search student by name, email, or roll number..."
      />
    </div>
  );
};
