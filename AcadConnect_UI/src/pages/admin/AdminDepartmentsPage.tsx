import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Building2, Users, FolderGit2 } from 'lucide-react';

export const AdminDepartmentsPage: React.FC = () => {
  const departments = [
    {
      name: 'Computer Science & Engineering',
      code: 'CSE',
      students: 9,
      faculty: 4,
      projects: 3,
      head: 'Dr. Rajesh Kumar',
    },
    {
      name: 'Information Technology',
      code: 'IT',
      students: 3,
      faculty: 2,
      projects: 1,
      head: 'Prof. Sneha Verma',
    },
    {
      name: 'Electronics & Communication',
      code: 'ECE',
      students: 4,
      faculty: 2,
      projects: 2,
      head: 'Dr. Vikram Seth',
    },
    {
      name: 'Mechanical Engineering',
      code: 'MECH',
      students: 2,
      faculty: 2,
      projects: 1,
      head: 'Dr. Ramesh Nair',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Departments"
        description="Departmental distribution of projects, student rosters, and allocated faculty"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <div key={dept.code} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  {dept.code}
                </span>
                <h3 className="mt-2 text-base sm:text-lg font-bold text-slate-900">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Head of Department: {dept.head}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-50">
                <p className="text-slate-400">Students</p>
                <p className="text-sm font-bold text-slate-800">{dept.students}</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <p className="text-slate-400">Faculty</p>
                <p className="text-sm font-bold text-slate-800">{dept.faculty}</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <p className="text-slate-400">Projects</p>
                <p className="text-sm font-bold text-indigo-600">{dept.projects}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
