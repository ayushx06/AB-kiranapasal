import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
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
    <main className="mx-auto max-w-md px-4 py-10">
      <form className="rounded-lg bg-white p-5 shadow-sm" onSubmit={submit}>
        <h1 className="text-2xl font-extrabold text-slate-950">Admin login</h1>
        <div className="mt-5 grid gap-4">
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <Button loading={loading}>Login</Button>
        </div>
      </form>
    </main>
  );
};
