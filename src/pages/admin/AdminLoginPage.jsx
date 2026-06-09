import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, Store } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginAdmin, loading } = useAuthStore();
  const [email, setEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL || '');
  const [password, setPassword] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    await loginAdmin(email, password);
    navigate('/admin');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 shadow-lg shadow-brand-900/40">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Admin Portal</h1>
          <p className="mt-2 text-slate-400">Abhishek Kirana Pasal - restricted access</p>
        </div>

        <form className="rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-2xl" onSubmit={submit}>
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-slate-700/50 px-4 py-3">
            <Shield className="h-4 w-4 text-brand-400" />
            <p className="text-xs font-semibold text-slate-300">Secure admin login for authorized personnel only</p>
          </div>

          <div className="space-y-5">
            <label className="block space-y-1">
              <span className="text-sm font-semibold text-slate-300">Email address</span>
              <span className="relative block">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@abhishekkirana.com"
                  required
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </span>
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-semibold text-slate-300">Password</span>
              <span className="relative block">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  required
                  className="w-full rounded-xl border border-slate-600 bg-slate-700 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-900/30 transition-all hover:bg-brand-600 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in to Admin Panel'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
