import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const { role } = useAuth();
  const homePath =
    role === 'ADMIN'
      ? '/admin/dashboard'
      : role === 'TEACHER'
      ? '/teacher/dashboard'
      : '/student/dashboard';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200 shadow-sm">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">403 — Access Denied</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-md leading-relaxed">
        You do not possess the required permission or institutional role to view this workspace.
        Every secured request is strictly enforced by the backend authority.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link to={homePath}>
          <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
