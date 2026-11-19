import React from 'react';
import { StatusPill } from '../common/StatusPill';
import { formatDate } from '../../utils/formatters';
import { Calendar, Users, FolderGit2, AlertTriangle, Lock } from 'lucide-react';

interface SubmissionHeaderProps {
  projectTitle: string;
  groupName: string;
  subgroupName: string;
  assignmentTitle?: string;
  deadline?: string;
  status?: string;
  isLocked?: boolean;
}

export const SubmissionHeader: React.FC<SubmissionHeaderProps> = ({
  projectTitle,
  groupName,
  subgroupName,
  assignmentTitle,
  deadline,
  status = 'PENDING',
  isLocked = false,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              {groupName}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Users className="w-3 h-3" />
              {subgroupName}
            </span>
          </div>

          <h2 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {projectTitle}
          </h2>

          {assignmentTitle && (
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600 flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-indigo-500" />
              <span>Assignment: {assignmentTitle}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:items-end gap-2">
          <StatusPill status={status} />
          {isLocked && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              <Lock className="w-3 h-3" />
              <span>Locked by Teacher</span>
            </span>
          )}
        </div>
      </div>

      {deadline && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-4 h-4 text-amber-500" />
          <span>
            Submission Deadline: <strong className="text-slate-700">{formatDate(deadline)}</strong>
          </span>
          {isLocked && (
            <span className="ml-auto text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Submission closed for evaluation
            </span>
          )}
        </div>
      )}
    </div>
  );
};
