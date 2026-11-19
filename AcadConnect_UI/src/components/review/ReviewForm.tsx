import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, ReviewFormData } from '../../utils/validators';
import { Button } from '../common/Button';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => Promise<void>;
  loading?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, loading = false }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      status: 'APPROVED',
      remarks: '',
    },
  });

  const selectedStatus = watch('status');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-1">Teacher Evaluation & Feedback</h3>
      <p className="text-xs text-slate-500 mb-5">
        Record official grading decision. Detailed remarks are required if requesting revisions or rejecting.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Status Radio Buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Evaluation Outcome
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              className={`border rounded-xl p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                selectedStatus === 'APPROVED'
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="radio"
                value="APPROVED"
                className="sr-only"
                {...register('status')}
              />
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm">Approve</p>
                <p className="text-[11px] font-normal text-slate-500">Deliverable passed</p>
              </div>
            </label>

            <label
              className={`border rounded-xl p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                selectedStatus === 'REVISION_REQUIRED'
                  ? 'border-amber-500 bg-amber-50/50 text-amber-900 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="radio"
                value="REVISION_REQUIRED"
                className="sr-only"
                {...register('status')}
              />
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm">Revision Needed</p>
                <p className="text-[11px] font-normal text-slate-500">Changes requested</p>
              </div>
            </label>

            <label
              className={`border rounded-xl p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                selectedStatus === 'REJECTED'
                  ? 'border-rose-500 bg-rose-50/50 text-rose-900 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="radio"
                value="REJECTED"
                className="sr-only"
                {...register('status')}
              />
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="text-sm">Reject</p>
                <p className="text-[11px] font-normal text-slate-500">Criteria unmet</p>
              </div>
            </label>
          </div>
          {errors.status && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.status.message}</p>
          )}
        </div>

        {/* Remarks */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Teacher Remarks & Review Feedback
            {(selectedStatus === 'REVISION_REQUIRED' || selectedStatus === 'REJECTED') && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
          <textarea
            rows={4}
            placeholder={
              selectedStatus === 'APPROVED'
                ? 'Optional congratulatory notes, commendations or next milestone recommendations...'
                : 'State specific issues found in code, tests, or documentation that must be corrected...'
            }
            className={`w-full rounded-lg border text-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.remarks ? 'border-red-300 bg-red-50/20' : 'border-slate-300'
            }`}
            {...register('remarks')}
          />
          {errors.remarks && (
            <p className="text-xs text-red-600 font-medium">{errors.remarks.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" loading={loading}>
            Record Evaluation
          </Button>
        </div>
      </form>
    </div>
  );
};
