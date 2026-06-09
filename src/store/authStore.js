import { create } from 'zustand';
import toast from 'react-hot-toast';
import { adminEmailLogin, getAdminStatus, logoutUser, sendPhoneOtp, verifyPhoneOtp } from '../firebase/auth';

export const useAuthStore = create((set) => ({
  user: null,
  isAdmin: false,
  loading: true,
  error: null,
  confirmationResult: null,
  setUser: async (user) => {
    const isAdmin = user ? await getAdminStatus(user.uid) : false;
    set({ user, isAdmin, loading: false });
  },
  loginWithPhone: async (phone) => {
    set({ loading: true, error: null });
    try {
      const confirmationResult = await sendPhoneOtp(phone);
      set({ confirmationResult, loading: false });
      toast.success('OTP sent');
      return confirmationResult;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
    }
  },
  verifyOTP: async (code) => {
    const { confirmationResult } = useAuthStore.getState();
    if (!confirmationResult) throw new Error('Please request OTP first.');
    set({ loading: true, error: null });
    try {
      const user = await verifyPhoneOtp(confirmationResult, code);
      const isAdmin = await getAdminStatus(user.uid);
      set({ user, isAdmin, loading: false, confirmationResult: null });
      toast.success('Logged in successfully');
      return user;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
    }
  },
  loginAdmin: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const credential = await adminEmailLogin(email, password);
      const isAdmin = await getAdminStatus(credential.user.uid);
      if (!isAdmin) throw new Error('This account is not an admin.');
      set({ user: credential.user, isAdmin, loading: false });
      return credential.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
    }
  },
  logout: async () => {
    await logoutUser();
    set({ user: null, isAdmin: false });
  }
}));
