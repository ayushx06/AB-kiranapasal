import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { loginWithPhone, verifyOTP, loading, confirmationResult } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const submitPhone = async (event) => {
    event.preventDefault();
    await loginWithPhone(phone);
  };

  const submitOtp = async (event) => {
    event.preventDefault();
    await verifyOTP(otp);
    navigate('/');
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-950">Phone login</h1>
        {!confirmationResult ? (
          <form className="mt-5 grid gap-4" onSubmit={submitPhone}>
            <Input label="Phone number" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+97798XXXXXXXX" required />
            <div id="recaptcha-container" />
            <Button loading={loading}>Send OTP</Button>
          </form>
        ) : (
          <form className="mt-5 grid gap-4" onSubmit={submitOtp}>
            <Input label="6-digit OTP" value={otp} onChange={(event) => setOtp(event.target.value)} maxLength={6} required />
            <Button loading={loading}>Verify and login</Button>
          </form>
        )}
      </div>
    </main>
  );
};
