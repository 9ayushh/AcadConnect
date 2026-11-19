import React from 'react';
import { CalendarClock, ArrowUpRight } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';

interface UpcomingDeadlineProps {
  deadlines?: { id: string; title: string; dueDate: string; groupName?: string }[];
}

export const UpcomingDeadline: React.FC<UpcomingDeadlineProps> = ({
  deadlines = [
    {
      id: 'd1',
      title: 'Sprint 3: Core Prototype & Architecture Review',
      dueDate: '2026-11-15T23:59:59.000Z',
      groupName: 'CS491 - Capstone Major Projects',
    },
    {
      id: 'd2',
      title: 'Final Code Hardening & Comprehensive Test Suite',
      dueDate: '2026-11-20T23:59:59.000Z',
      groupName: 'CS491 - Capstone Major Projects',
    },
  ],
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <CalendarClock className="w-4 h-4" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">Upcoming Deadlines</h3>
        </div>
        <Link
          to="/student/assignments"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-0.5"
        >
          <span>All Assignments</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3 flex-1">
        {deadlines.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-800 leading-snug">{item.title}</h4>
              <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                {formatDate(item.dueDate)}
              </span>
            </div>
            {item.groupName && (
              <p className="mt-1 text-xs text-slate-500">{item.groupName}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
