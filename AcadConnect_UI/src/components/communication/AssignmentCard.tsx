import React from 'react';
import { Assignment } from '../../types';
import { formatDate } from '../../utils/formatters';
import { StatusPill } from '../common/StatusPill';
import { Calendar, Lock, Unlock, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

interface AssignmentCardProps {
  assignment: Assignment;
  isTeacher?: boolean;
  onToggleLock?: (id: string) => void;
  onExportExcel?: (id: string) => void;
  onAction?: (assignment: Assignment) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  isTeacher = false,
  onToggleLock,
  onExportExcel,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Assignment Deliverable
              </span>
              {assignment.isLocked && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">
                  <Lock className="w-3 h-3" />
                  Locked
                </span>
              )}
            </div>
            <h3 className="mt-1 text-base font-bold text-slate-900 leading-snug">
              {assignment.title}
            </h3>
          </div>
          <StatusPill status={assignment.status} size="sm" />
        </div>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {assignment.description}
        </p>

        {/* Counts summary (Submitted / Pending / Late) */}
        {isTeacher && (
          <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
            <div>
              <p className="text-[11px] text-slate-500">Submitted</p>
              <p className="text-sm font-bold text-emerald-600">{assignment.submittedCount}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Pending</p>
              <p className="text-sm font-bold text-slate-700">{assignment.pendingCount}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Late</p>
              <p className="text-sm font-bold text-amber-600">{assignment.lateCount}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Due: <strong className="text-slate-800 font-semibold">{formatDate(assignment.deadline)}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {isTeacher && onExportExcel && (
            <button
              type="button"
              onClick={() => onExportExcel(assignment.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              title="Export assignment submission spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export</span>
            </button>
          )}

          {isTeacher && onToggleLock && (
            <button
              type="button"
              onClick={() => onToggleLock(assignment.id)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              title={assignment.isLocked ? 'Unlock assignment' : 'Lock assignment'}
            >
              {assignment.isLocked ? <Lock className="w-3.5 h-3.5 text-rose-600" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
          )}

          {onAction && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAction(assignment)}
              disabled={!isTeacher && assignment.isLocked}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {isTeacher ? 'View Submissions' : assignment.isLocked ? 'Locked' : 'Submit Work'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
