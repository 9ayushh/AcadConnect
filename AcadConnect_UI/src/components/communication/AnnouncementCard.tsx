import React from 'react';
import { Announcement } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { Megaphone, GraduationCap } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
          <Megaphone className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {announcement.title}
            </h3>
            <span className="text-xs text-slate-400">
              {formatDateTime(announcement.createdAt)}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {announcement.content}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
            <span>Posted by <strong className="text-slate-700">{announcement.authorName}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
