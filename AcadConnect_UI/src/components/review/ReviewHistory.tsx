import React from 'react';
import { ReviewHistoryEntry } from '../../types';
import { StatusPill } from '../common/StatusPill';
import { formatDateTime } from '../../utils/formatters';
import { MessageSquareQuote, History } from 'lucide-react';

interface ReviewHistoryProps {
  history?: ReviewHistoryEntry[];
}

export const ReviewHistory: React.FC<ReviewHistoryProps> = ({ history = [] }) => {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center">
        <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-700">No Review History</h4>
        <p className="text-xs text-slate-400 mt-1">
          Teacher evaluation events will appear here once reviewed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
        <History className="w-4 h-4 text-indigo-600" />
        <span>Evaluation Log & History</span>
      </h3>

      <div className="space-y-4">
        {history.map((rev) => (
          <div
            key={rev.id}
            className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <StatusPill status={rev.status} size="sm" />
                <span className="text-xs font-semibold text-slate-700">{rev.reviewerName}</span>
              </div>
              <span className="text-[11px] text-slate-400">{formatDateTime(rev.createdAt)}</span>
            </div>

            <div className="flex items-start gap-2 pt-1 text-xs text-slate-600 leading-relaxed">
              <MessageSquareQuote className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="italic font-normal">"{rev.remarks}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
