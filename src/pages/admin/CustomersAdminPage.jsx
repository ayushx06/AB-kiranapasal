import { useEffect, useMemo, useState } from 'react';
import { CustomerTable } from '../../components/admin/CustomerTable';
import { Input } from '../../components/ui/Input';
import { fetchCustomers } from '../../firebase/firestore';

export const CustomersAdminPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(() => { fetchCustomers().then(setCustomers).catch(() => setCustomers([])); }, []);
  const filtered = useMemo(() => customers.filter((customer) => `${customer.phone} ${customer.name}`.toLowerCase().includes(search.toLowerCase())), [customers, search]);

  return (
    <main className="flex-1 p-4 md:p-6">
      <h1 className="mb-5 text-2xl font-extrabold text-slate-950">Customers</h1>
      <div className="mb-4 max-w-sm"><Input label="Search by phone" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      <CustomerTable customers={filtered} />
    </main>
  );
};
