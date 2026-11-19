import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionService } from '../../services/submissionService';
import { reviewService } from '../../services/reviewService';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusPill } from '../../components/common/StatusPill';
import { ReviewForm } from '../../components/review/ReviewForm';
import { ReviewHistory } from '../../components/review/ReviewHistory';
import { MemberList } from '../../components/group/MemberList';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { formatDate } from '../../utils/formatters';
import {
  GitBranch,
  FileArchive,
  FileText,
  ExternalLink,
  Calendar,
  Send,
  Bell,
  ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const TeacherSubmissionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [reminderMessage, setReminderMessage] = useState(
    'Please note that your capstone milestone review requires updates. Ensure your revised assembly files and synopsis report are pushed.'
  );

  const { data: submission, isLoading } = useQuery({
    queryKey: ['submission', id],
    queryFn: () => submissionService.getSubmissionById(id || 'sub-1'),
  });

  const reviewMutation = useMutation({
    mutationFn: (data: { status: 'APPROVED' | 'REVISION_REQUIRED' | 'REJECTED'; remarks: string }) =>
      reviewService.submitReview({
        submissionId: id || 'sub-1',
        status: data.status,
        remarks: data.remarks,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submission', id] });
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast.success('Evaluation feedback recorded successfully!');
    },
    onError: (err: unknown) => {
      toast.error((err as { message?: string })?.message || 'Failed to submit review');
    },
  });

  const reminderMutation = useMutation({
    mutationFn: () =>
      reviewService.sendReminder(submission?.subgroupId || 'subgroup-1', reminderMessage),
    onSuccess: () => {
      toast.success('Reminder message dispatched to subgroup members!');
      setIsReminderOpen(false);
    },
  });

  if (isLoading || !submission) {
    return <Loader size="lg" label="Loading submission review dossier..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('/teacher/submissions')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Submissions</span>
        </button>
      </div>

      <PageHeader
        title={submission.projectTitle}
        description={`Subgroup: ${submission.subgroupName} • Assignment: ${submission.assignmentTitle || 'Milestone 3'}`}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReminderOpen(true)}
              icon={<Bell className="w-4 h-4 text-amber-500" />}
            >
              Send Reminder
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Deliverable Details (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Submitted Deliverable
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Project Technical Summary</h3>
              </div>
              <StatusPill status={submission.status} />
            </div>

            <p className="mt-3 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {submission.description}
            </p>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>
                Submission Timestamp:{' '}
                <strong className="text-slate-800 font-semibold">
                  {formatDate(submission.submittedAt)}
                </strong>
              </span>
            </div>
          </div>

          {/* Artifact Downloads & External Links */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Submission Artifacts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* GitHub Link */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900">GitHub Repository</p>
                    <p className="text-[11px] text-slate-500 truncate">{submission.githubUrl}</p>
                  </div>
                </div>
                <a
                  href={submission.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-indigo-600 hover:text-indigo-800"
                  title="Open GitHub repository"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Source Archive File */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileArchive className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900">Project Archive</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {submission.projectFileName || 'download_bundle.zip'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success('Downloading project archive...')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2.5 py-1 rounded-lg hover:bg-indigo-50"
                >
                  Download
                </button>
              </div>

              {/* Synopsis PDF Document */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between sm:col-span-2">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900">Project Synopsis Document</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {submission.synopsisFileName || 'synopsis.pdf'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success('Opening synopsis document preview...')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2.5 py-1 rounded-lg hover:bg-indigo-50"
                >
                  View Synopsis
                </button>
              </div>
            </div>
          </div>

          {/* Review Form Component */}
          <ReviewForm
            onSubmit={async (data) => {
              await reviewMutation.mutateAsync(data);
            }}
            loading={reviewMutation.isPending}
          />
        </div>

        {/* Right: Team Members & Review History (1 Col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Subgroup Authors</h3>
            <MemberList members={submission.members || []} />
          </div>

          <ReviewHistory history={submission.reviewHistory || []} />
        </div>
      </div>

      {/* Send Reminder Modal */}
      <Modal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        title={`Send Reminder to ${submission.subgroupName}`}
        description="This message will be dispatched directly to all registered students in this subgroup."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsReminderOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => reminderMutation.mutate()}
              loading={reminderMutation.isPending}
              icon={<Send className="w-4 h-4" />}
            >
              Send Reminder
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">Reminder Content</label>
          <textarea
            rows={4}
            value={reminderMessage}
            onChange={(e) => setReminderMessage(e.target.value)}
            className="w-full rounded-lg border border-slate-300 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </Modal>
    </div>
  );
};
