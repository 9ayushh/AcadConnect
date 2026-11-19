import api from './api';
import { ENDPOINTS } from './endpoints';
import { Assignment } from '../types';
import { CreateAssignmentFormData } from '../utils/validators';

export const assignmentService = {
  async getAssignments(groupId: string): Promise<Assignment[]> {
    const res = await api.get<Assignment[]>(ENDPOINTS.ASSIGNMENTS(groupId));
    return res.data;
  },

  async createAssignment(groupId: string, data: CreateAssignmentFormData): Promise<Assignment> {
    const res = await api.post<Assignment>(ENDPOINTS.ASSIGNMENTS(groupId), data);
    return res.data;
  },

  async toggleLock(id: string): Promise<Assignment> {
    const res = await api.put<Assignment>(ENDPOINTS.ASSIGNMENT_TOGGLE_LOCK(id));
    return res.data;
  },
};
