import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { fetchDeliveryZones, saveDeliveryZone, deleteDeliveryZone, listenShopSettings, updateShopSettings } from '../../firebase/firestore';
import { DEFAULT_SETTINGS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export const DeliveryAdminPage = () => {
  const [zones, setZones] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [draft, setDraft] = useState({ name: '', nameNe: '', distanceKm: 1, charge: 50, estimatedMinutes: 20 });

  useEffect(() => { fetchDeliveryZones().then(setZones); }, []);
  useEffect(() => listenShopSettings(setSettings), []);

  const addZone = async (event) => {
    event.preventDefault();
    const id = await saveDeliveryZone({ ...draft, distanceKm: Number(draft.distanceKm), charge: Number(draft.charge), estimatedMinutes: Number(draft.estimatedMinutes) });
    setZones((current) => [...current, { ...draft, id }]);
    setDraft({ name: '', nameNe: '', distanceKm: 1, charge: 50, estimatedMinutes: 20 });
    toast.success('Delivery zone saved');
  };

  return (
    <main className="flex-1 p-4 md:p-6">
      <h1 className="mb-5 text-2xl font-extrabold text-slate-950">Delivery settings</h1>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-bold">Pricing rules</h2>
          <div className="grid gap-3">
            <Input label="Charge per km" type="number" value={settings.deliveryChargePerKm} onChange={(event) => setSettings({ ...settings, deliveryChargePerKm: Number(event.target.value) })} />
            <Input label="Free delivery above" type="number" value={settings.freeDeliveryAbove} onChange={(event) => setSettings({ ...settings, freeDeliveryAbove: Number(event.target.value) })} />
            <Input label="Minimum order amount" type="number" value={settings.minOrderAmount} onChange={(event) => setSettings({ ...settings, minOrderAmount: Number(event.target.value) })} />
            <Button onClick={() => updateShopSettings(settings).then(() => toast.success('Settings saved'))}>Save settings</Button>
          </div>
        </section>
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-bold">Add delivery zone</h2>
          <form className="grid gap-3" onSubmit={addZone}>
            <Input label="Zone name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
            <Input label="Nepali name" value={draft.nameNe} onChange={(event) => setDraft({ ...draft, nameNe: event.target.value })} />
            <Input label="Distance km" type="number" value={draft.distanceKm} onChange={(event) => setDraft({ ...draft, distanceKm: event.target.value })} />
            <Input label="Charge" type="number" value={draft.charge} onChange={(event) => setDraft({ ...draft, charge: event.target.value })} />
            <Input label="Estimated minutes" type="number" value={draft.estimatedMinutes} onChange={(event) => setDraft({ ...draft, estimatedMinutes: event.target.value })} />
            <Button>Add zone</Button>
          </form>
        </section>
      </div>
      <section className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => (
          <div key={zone.id} className="rounded-lg bg-white p-4 shadow-sm">
            <div className="font-bold">{zone.name}</div>
            <div className="text-sm text-slate-500">{zone.distanceKm} km · {zone.estimatedMinutes} min</div>
            <div className="mt-2 font-bold text-brand-600">{formatCurrency(zone.charge)}</div>
            <Button variant="danger" className="mt-3" onClick={() => deleteDeliveryZone(zone.id).then(() => setZones((current) => current.filter((item) => item.id !== zone.id)))}>Delete</Button>
          </div>
        ))}
      </section>
    </main>
  );
};
