import api from './api';
import { ENDPOINTS } from './endpoints';
import { Announcement } from '../types';
import { CreateAnnouncementFormData } from '../utils/validators';

export const announcementService = {
  async getAnnouncements(groupId: string): Promise<Announcement[]> {
    const res = await api.get<Announcement[]>(ENDPOINTS.ANNOUNCEMENTS(groupId));
    return res.data;
  },

  async createAnnouncement(groupId: string, data: CreateAnnouncementFormData): Promise<Announcement> {
    const res = await api.post<Announcement>(ENDPOINTS.ANNOUNCEMENTS(groupId), data);
    return res.data;
  },
};
