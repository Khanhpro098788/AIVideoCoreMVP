import { User } from '../types/auth.types';
import api from './api';

export const authService = {
  signup: async (data: any) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },
  
  signin: async (data: any) => {
    const response = await api.post('/auth/signin', data);
    return response.data; // Should return { accessToken } and set HttpOnly Cookie
  },
  
  signout: async () => {
    const response = await api.post('/auth/signout');
    return response.data;
  },
  
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  updatePassword: async (data: any) => {
    const response = await api.patch('/auth/password', data);
    return response.data;
  },
  
  verifyOtp: async (data: { email: string; otp: string }) => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  resendOtp: async (data: { email: string }) => {
    const response = await api.post('/auth/resend-otp', data);
    return response.data;
  }
};
