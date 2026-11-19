import api from './api';
import { ENDPOINTS } from './endpoints';
import { User } from '../types';
import { LoginFormData, RegisterFormData } from '../utils/validators';

export interface AuthResponse {
  user: User;
  token?: string;
}

export const authService = {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>(ENDPOINTS.LOGIN, data);
    return res.data;
  },

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>(ENDPOINTS.REGISTER, data);
    return res.data;
  },

  async getCurrentUser(): Promise<User> {
    const res = await api.get<{ user: User }>(ENDPOINTS.ME);
    return res.data.user;
  },

  async refreshToken(): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>(ENDPOINTS.REFRESH);
    return res.data;
  },

  async logout(): Promise<void> {
    await api.post(ENDPOINTS.LOGOUT);
  },
};
