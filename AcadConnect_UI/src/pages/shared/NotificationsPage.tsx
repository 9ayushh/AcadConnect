import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../services/notificationService';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatters';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const NotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  if (isLoading) {
    return <Loader size="lg" label="Loading notifications..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Notifications & Alerts"
        description="Stay up to date with teacher reviews, feedback remarks, and announcement broadcasts"
      />

      {notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                n.isRead
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-indigo-50/50 border-indigo-200 text-slate-900 shadow-2xs'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  n.isRead ? 'bg-slate-100 text-slate-500' : 'bg-indigo-600 text-white'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold leading-snug">{n.title}</h4>
                  <span className="text-[11px] text-slate-400">{formatDateTime(n.createdAt)}</span>
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{n.message}</p>

                <div className="mt-3 flex items-center gap-3">
                  {n.link && (
                    <Link
                      to={n.link}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      <span>View details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}

                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={() => markReadMutation.mutate(n.id)}
                      className="text-xs text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Mark as read</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Notifications"
          description="You're all caught up! When updates arrive, they will appear here."
        />
      )}
    </div>
  );
};
