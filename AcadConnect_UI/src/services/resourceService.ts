import api from './api';
import { ENDPOINTS } from './endpoints';
import { Resource } from '../types';
import { CreateResourceFormData } from '../utils/validators';

export const resourceService = {
  async getResources(groupId: string): Promise<Resource[]> {
    const res = await api.get<Resource[]>(ENDPOINTS.RESOURCES(groupId));
    return res.data;
  },

  async createResource(groupId: string, data: CreateResourceFormData): Promise<Resource> {
    const res = await api.post<Resource>(ENDPOINTS.RESOURCES(groupId), data);
    return res.data;
  },

  async deleteResource(id: string): Promise<{ message: string }> {
    const res = await api.delete<{ message: string }>(ENDPOINTS.RESOURCE_BY_ID(id));
    return res.data;
  },
};
