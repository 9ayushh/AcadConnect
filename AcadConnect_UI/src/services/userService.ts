import api from './api';
import { ENDPOINTS } from './endpoints';
import { User } from '../types';

export const userService = {
  async getUsers(): Promise<User[]> {
    const res = await api.get<User[]>(ENDPOINTS.USERS);
    return res.data;
  },

  async createUser(data: Partial<User>): Promise<User> {
    const res = await api.post<User>(ENDPOINTS.USERS, data);
    return res.data;
  },
};
