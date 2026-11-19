import React from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, Upload, MessageSquareQuote, Users } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      label: 'View Project',
      desc: 'Check milestones & progress',
      to: '/student/project',
      icon: FolderGit2,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
    },
    {
      label: 'Upload Submission',
      desc: 'Submit repository & report',
      to: '/student/submission',
      icon: Upload,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    },
    {
      label: 'View Feedback',
      desc: 'Teacher remarks & status',
      to: '/student/feedback',
      icon: MessageSquareQuote,
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    },
    {
      label: 'My Group',
      desc: 'Manage subgroup & invites',
      to: '/student/group',
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.to}
              to={act.to}
              className={`p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 ${act.color}`}
            >
              <div className="p-2 rounded-lg bg-white/80 shrink-0 shadow-2xs">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900">{act.label}</h4>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{act.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
