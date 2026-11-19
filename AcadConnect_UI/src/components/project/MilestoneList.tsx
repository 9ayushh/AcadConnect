import React from 'react';
import { Milestone } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { formatDate } from '../../utils/formatters';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface MilestoneListProps {
  milestones: Milestone[];
}

export const MilestoneList: React.FC<MilestoneListProps> = ({ milestones }) => {
  const sorted = [...milestones].sort((a, b) => a.order - b.order);

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {sorted.map((m, idx) => {
        const isDone = m.status === 'APPROVED';

        return (
          <div key={m.id || idx} className="relative group">
            {/* Step marker pin */}
            <div
              className={`absolute -left-[30px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                isDone
                  ? 'bg-emerald-600 border-white text-white shadow-xs'
                  : 'bg-white border-slate-300 text-slate-500'
              }`}
            >
              {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                  {m.description && (
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {m.description}
                    </p>
                  )}
                </div>
                <StatusPill status={m.status} size="sm" />
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Target: <strong>{formatDate(m.dueDate)}</strong></span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
