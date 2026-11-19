import React from 'react';
import { MainGroup } from '../../types';
import { Users, FolderGit2, Calendar, Copy, Check } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface GroupCardProps {
  group: MainGroup;
  onOpen?: () => void;
  showActions?: boolean;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onOpen, showActions = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyInvite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/join/${group.inviteCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Invite link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onOpen}
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm transition-all ${
        onOpen ? 'cursor-pointer hover:shadow-md hover:border-indigo-200' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            Instructor: {group.teacherName}
          </span>
          <h3 className="mt-1 text-base sm:text-lg font-bold text-slate-900">{group.name}</h3>
        </div>
        <span
          className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
            group.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {group.isActive ? 'Active' : 'Archived'}
        </span>
      </div>

      <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
        {group.description}
      </p>

      {/* Meta indicators */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <strong>{group.memberCount}</strong> students
          </span>
          <span className="flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
            <strong>{group.subgroupCount}</strong> subgroups
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(group.createdAt)}</span>
        </div>
      </div>

      {/* Invite Code button */}
      {showActions && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">
            {group.inviteCode}
          </span>
          <button
            type="button"
            onClick={handleCopyInvite}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded hover:bg-indigo-50"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
