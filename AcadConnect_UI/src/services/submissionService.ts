import api from './api';
import { ENDPOINTS } from './endpoints';
import { Submission } from '../types';

export interface CreateSubmissionPayload {
  projectId: string;
  title: string;
  description: string;
  githubUrl: string;
  projectFileUrl?: string;
  projectFileName?: string;
  synopsisUrl?: string;
  synopsisFileName?: string;
  otherLink?: string;
}

export const submissionService = {
  async getSubmissions(): Promise<Submission[]> {
    const res = await api.get<Submission[]>(ENDPOINTS.SUBMISSIONS);
    return res.data;
  },

  async getSubmissionById(id: string): Promise<Submission> {
    const res = await api.get<Submission>(ENDPOINTS.SUBMISSION_BY_ID(id));
    return res.data;
  },

  async createSubmission(payload: CreateSubmissionPayload): Promise<Submission> {
    const res = await api.post<Submission>(ENDPOINTS.SUBMISSIONS, payload);
    return res.data;
  },

  async updateSubmission(id: string, payload: Partial<CreateSubmissionPayload>): Promise<Submission> {
    const res = await api.put<Submission>(ENDPOINTS.SUBMISSION_BY_ID(id), payload);
    return res.data;
  },
};
