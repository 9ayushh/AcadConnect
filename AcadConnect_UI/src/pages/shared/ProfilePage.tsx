import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/common/PageHeader';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { User, Mail, Hash, Building2, Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personal Profile & Account"
        description="View institutional credentials, enrolled degree program, and manage your account details"
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-3xl">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <span className="mt-1.5 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              {user?.role} Account
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              defaultValue={user?.name}
              leftIcon={<User className="w-4 h-4" />}
            />
            <Input
              label="Institutional Email (Read Only)"
              value={user?.email}
              disabled
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Roll / Registration Number"
              defaultValue={user?.rollNumber || '21CSE001'}
              leftIcon={<Hash className="w-4 h-4" />}
            />
            <Input
              label="Department"
              defaultValue={user?.department || 'Computer Science & Engineering'}
              leftIcon={<Building2 className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Course / Branch"
              defaultValue={user?.course || 'B.Tech CSE'}
            />
            <Input
              label="Academic Year"
              defaultValue={user?.academicYear || '2026-2027'}
              leftIcon={<Calendar className="w-4 h-4" />}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
