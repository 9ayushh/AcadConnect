import api from './api';
import { ENDPOINTS } from './endpoints';
import { SubmissionStatusType } from '../types';

export interface SubmitReviewPayload {
  submissionId: string;
  status: SubmissionStatusType;
  remarks: string;
}

export const reviewService = {
  async submitReview(payload: SubmitReviewPayload): Promise<{ message: string }> {
    const res = await api.post<{ message: string }>(ENDPOINTS.REVIEWS, payload);
    return res.data;
  },

  async sendReminder(subgroupId: string, message: string): Promise<{ message: string }> {
    const res = await api.post<{ message: string }>(ENDPOINTS.SEND_REMINDER, { subgroupId, message });
    return res.data;
  },
};
