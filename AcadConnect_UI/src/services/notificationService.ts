import api from './api';
import { ENDPOINTS } from './endpoints';
import { NotificationItem } from '../types';

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await api.get<NotificationItem[]>(ENDPOINTS.NOTIFICATIONS);
    return res.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.post(ENDPOINTS.NOTIFICATION_MARK_READ(id));
  },
};
