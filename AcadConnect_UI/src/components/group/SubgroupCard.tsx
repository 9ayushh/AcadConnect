import React from 'react';
import { Subgroup } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { Users, FolderGit2, ArrowRight } from 'lucide-react';
import { SUBGROUP_MAX_MEMBERS } from '../../utils/constants';

interface SubgroupCardProps {
  subgroup: Subgroup;
  onOpen?: () => void;
  isTeacherView?: boolean;
}

export const SubgroupCard: React.FC<SubgroupCardProps> = ({
  subgroup,
  onOpen,
  isTeacherView = false,
}) => {
  const memberSlotsUsed = subgroup.members.length;

  return (
    <div
      onClick={onOpen}
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-sm transition-all ${
        onOpen ? 'cursor-pointer hover:shadow-md hover:border-indigo-200' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Subgroup • Created by {subgroup.creatorName}
          </span>
          <h4 className="text-base font-bold text-slate-900 mt-0.5">{subgroup.name}</h4>
        </div>
        <StatusPill status={subgroup.submissionStatus} size="sm" />
      </div>

      {subgroup.description && (
        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {subgroup.description}
        </p>
      )}

      {subgroup.projectTitle && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50/70 px-2.5 py-1.5 rounded-lg border border-indigo-100">
          <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
          <span className="font-medium truncate">{subgroup.projectTitle}</span>
        </div>
      )}

      {/* Member count indicator (Enforcing max 3 members per §19, §0) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-slate-400" />
          <span>
            <strong className="text-slate-800">{memberSlotsUsed}</strong> of{' '}
            <strong>{SUBGROUP_MAX_MEMBERS}</strong> slots filled
          </span>
        </div>

        {onOpen && (
          <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
            <span>{isTeacherView ? 'Evaluate Subgroup' : 'Open Subgroup'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );
};
