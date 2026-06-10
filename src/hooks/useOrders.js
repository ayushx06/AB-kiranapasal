import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { listenAllOrders, listenCustomerOrders } from '../firebase/firestore';

export const useOrders = (customerId, { admin = false } = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(Boolean(customerId || admin));

  useEffect(() => {
    if (!customerId && !admin) return undefined;
    setLoading(true);
    try {
      const handler = (data) => {
        setOrders(data);
        setLoading(false);
      };
      const unsubscribe = admin ? listenAllOrders(handler) : listenCustomerOrders(customerId, handler);
      return unsubscribe;
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
      return undefined;
    }
  }, [admin, customerId]);

  return { orders, loading };
};
