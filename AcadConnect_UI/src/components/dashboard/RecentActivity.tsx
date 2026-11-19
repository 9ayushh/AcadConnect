import React from 'react';
import { MessageSquare, Upload, CheckCircle2, Megaphone } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

interface ActivityItem {
  id: string;
  type: 'FEEDBACK' | 'UPLOAD' | 'STATUS' | 'ANNOUNCEMENT';
  title: string;
  description: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = [
    {
      id: 'act-1',
      type: 'FEEDBACK',
      title: 'Teacher Review Recorded',
      description: 'Dr. Rajesh Kumar added remarks on your Sprint 3 Prototype.',
      timestamp: '2026-11-05T09:00:00.000Z',
    },
    {
      id: 'act-2',
      type: 'ANNOUNCEMENT',
      title: 'Capstone Evaluation Schedule',
      description: 'New guidelines posted for Division A viva presentations.',
      timestamp: '2026-11-05T08:30:00.000Z',
    },
    {
      id: 'act-3',
      type: 'UPLOAD',
      title: 'Sprint 3 Artifacts Uploaded',
      description: 'Repository commit & project zip bundle synced.',
      timestamp: '2026-11-04T18:30:00.000Z',
    },
  ],
}) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'FEEDBACK':
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
      case 'ANNOUNCEMENT':
        return <Megaphone className="w-4 h-4 text-amber-600" />;
      case 'UPLOAD':
        return <Upload className="w-4 h-4 text-blue-600" />;
      case 'STATUS':
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Recent Project Activity</h3>
      <div className="divide-y divide-slate-100">
        {activities.map((act) => (
          <div key={act.id} className="py-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
              {getIcon(act.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800">{act.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{act.description}</p>
            </div>
            <span className="shrink-0 text-[11px] text-slate-400">
              {formatDateTime(act.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
