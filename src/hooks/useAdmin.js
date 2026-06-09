import { useAuthStore } from '../store/authStore';

export const useAdmin = () => {
  const { user, isAdmin, loading } = useAuthStore();
  return { user, isAdmin, loading };
};
