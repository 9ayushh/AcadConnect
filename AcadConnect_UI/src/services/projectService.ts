import api from './api';
import { ENDPOINTS } from './endpoints';
import { Project } from '../types';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const res = await api.get<Project[]>(ENDPOINTS.PROJECTS);
    return res.data;
  },

  async getProjectById(id: string): Promise<Project> {
    const res = await api.get<Project>(ENDPOINTS.PROJECT_BY_ID(id));
    return res.data;
  },
};
