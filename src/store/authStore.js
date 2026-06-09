import { create } from 'zustand';
import toast from 'react-hot-toast';
import { adminEmailLogin, ensureCustomerProfile, logoutUser, sendPhoneOtp, verifyPhoneOtp } from '../firebase/auth';

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  error: null,
  confirmationResult: null,
  pendingName: '',
  setUser: async (user) => {
    const profile = user ? await ensureCustomerProfile(user) : null;
    set({ user, profile, isAdmin: profile?.isAdmin === true, loading: false });
  },
  loginWithPhone: async (phone, name = '') => {
    set({ loading: true, error: null, pendingName: name.trim() });
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
  verifyOTP: async (code, name = '') => {
    const { confirmationResult, pendingName } = useAuthStore.getState();
    if (!confirmationResult) throw new Error('Please request OTP first.');
    set({ loading: true, error: null });
    try {
      const customerName = name.trim() || pendingName || 'Customer';
      const user = await verifyPhoneOtp(confirmationResult, code, { name: customerName });
      const profileSnap = await ensureCustomerProfile(user);
      const profile = profileSnap.data();
      set({ user, profile, isAdmin: profile?.isAdmin === true, loading: false, confirmationResult: null, pendingName: '' });
      toast.success(`Welcome, ${profile?.name || customerName}`);
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
      const profileSnap = await ensureCustomerProfile(credential.user);
      const profile = profileSnap.data();
      if (profile?.isAdmin !== true) throw new Error('This account is not an admin.');
      set({ user: credential.user, profile, isAdmin: true, loading: false });
      return credential.user;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message);
      throw error;
    }
  },
  logout: async () => {
    await logoutUser();
    set({ user: null, profile: null, isAdmin: false, confirmationResult: null, pendingName: '' });
    toast.success('Logged out successfully');
  }
}));
