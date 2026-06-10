import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, KeyRound, Phone, ShieldCheck, Store, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { loginWithPhone, verifyOTP, loading, confirmationResult } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  const resetOtp = () => useAuthStore.setState({ confirmationResult: null, pendingName: '' });

  const submitPhone = async (event) => {
    event.preventDefault();
    await loginWithPhone(phone, name);
  };

  const submitOtp = async (event) => {
    event.preventDefault();
    await verifyOTP(otp, name);
    navigate('/');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-orange-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 shadow-lg shadow-brand-200">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="mt-2 text-slate-500">Login to Abhishek Kirana Pasal</p>
          <p className="mt-1 text-xs text-slate-400">Pokhara&apos;s trusted kirana store</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100">
          {!confirmationResult ? (
            <form className="space-y-5" onSubmit={submitPhone}>
              <div>
                <h2 className="mb-1 text-lg font-bold text-slate-800">Enter your details</h2>
                <p className="text-sm text-slate-500">We&apos;ll send an OTP to verify your number.</p>
              </div>

              <label className="block space-y-1">
                <span className="text-sm font-semibold text-slate-700">Your full name</span>
                <span className="relative block">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Ayush Subedi"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  />
                </span>
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-semibold text-slate-700">Phone number</span>
                <span className="relative block">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  />
                </span>
              </label>

              <div id="recaptcha-container" className="flex justify-center" />

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-200 transition-all hover:bg-brand-600 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'Sending...' : <>Send OTP <ArrowRight className="h-4 w-4" /></>}
              </button>

              <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3">
                <ShieldCheck className="h-4 w-4 shrink-0 text-green-600" />
                <p className="text-xs font-medium text-green-700">Your number is safe. We only use it for login.</p>
              </div>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={submitOtp}>
              <div>
                <h2 className="mb-1 text-lg font-bold text-slate-800">Enter OTP</h2>
                <p className="text-sm text-slate-500">
                  6-digit code sent to <span className="font-semibold text-slate-700">{phone}</span>
                </p>
              </div>

              <label className="block space-y-1">
                <span className="text-sm font-semibold text-slate-700">OTP code</span>
                <span className="relative block">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-center text-lg font-medium tracking-widest text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  />
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-200 transition-all hover:bg-brand-600 active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'Verifying...' : <>Verify & Login <ArrowRight className="h-4 w-4" /></>}
              </button>

              <button
                type="button"
                onClick={resetOtp}
                className="w-full text-sm font-semibold text-slate-500 transition-colors hover:text-brand-600"
              >
                Wrong number? Go back
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">By logging in, you agree to our terms of service.</p>
      </div>
    </main>
  );
};
