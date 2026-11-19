import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { submissionService } from '../../services/submissionService';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusPill } from '../../components/common/StatusPill';
import { ReviewHistory } from '../../components/review/ReviewHistory';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/formatters';
import { MessageSquareQuote, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const StudentFeedbackPage: React.FC = () => {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => submissionService.getSubmissions(),
  });

  if (isLoading) {
    return <Loader size="lg" label="Loading teacher feedback..." />;
  }

  const submission = submissions && submissions.length > 0 ? submissions[0] : null;

  if (!submission) {
    return (
      <EmptyState
        title="No Evaluations Yet"
        description="You have not submitted any project deliverables for review yet. Submit your project files to receive instructor feedback."
        actionLabel="Go to Submission Portal"
        onAction={() => window.location.assign('/student/submission')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Review & Feedback"
        description="View official grading assessments, remarks, and revision requests from your instructor"
        action={
          submission.status === 'REVISION_REQUIRED' ? (
            <Link to="/student/submission">
              <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                Submit Revision
              </Button>
            </Link>
          ) : undefined
        }
      />

      {/* Latest Evaluation Highlight Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              {submission.subgroupName}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              {submission.projectTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Last updated: {formatDateTime(submission.lastUpdatedAt || submission.submittedAt)}
            </p>
          </div>
          <StatusPill status={submission.status} />
        </div>

        {/* Remarks banner */}
        <div
          className={`mt-5 p-5 rounded-xl border ${
            submission.status === 'APPROVED'
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : submission.status === 'REVISION_REQUIRED'
              ? 'bg-amber-50/70 border-amber-200 text-amber-900'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-start gap-3">
            {submission.status === 'APPROVED' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : submission.status === 'REVISION_REQUIRED' ? (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <MessageSquareQuote className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Current Instructor Assessment
              </h4>
              <p className="mt-1 text-sm leading-relaxed">
                {submission.teacherRemarks ||
                  'Your deliverable is queued for review by the academic panel. Check back shortly.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Review Timeline */}
      <ReviewHistory history={submission.reviewHistory || []} />
    </div>
  );
};
