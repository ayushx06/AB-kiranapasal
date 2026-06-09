import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from './config';
import { DEFAULT_SETTINGS, DELIVERY_ZONES, SAMPLE_PRODUCTS } from '../utils/constants';

const withId = (snapshot) => ({ id: snapshot.id, ...snapshot.data() });

export const listenProducts = (callback) => {
  const q = query(collection(db, 'products'), where('isActive', '==', true), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(withId)));
};

export const fetchProducts = async () => {
  const snapshot = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
  const products = snapshot.docs.map(withId);
  return products.length ? products : SAMPLE_PRODUCTS;
};

export const fetchProduct = async (id) => {
  const snapshot = await getDoc(doc(db, 'products', id));
  if (snapshot.exists()) return withId(snapshot);
  return SAMPLE_PRODUCTS.find((product) => product.id === id) || null;
};

export const saveProduct = async (product) => {
  const payload = { ...product, updatedAt: serverTimestamp() };
  if (product.id) {
    await updateDoc(doc(db, 'products', product.id), payload);
    return product.id;
  }
  const ref = await addDoc(collection(db, 'products'), { ...payload, createdAt: serverTimestamp() });
  return ref.id;
};

export const removeProduct = (id) => deleteDoc(doc(db, 'products', id));

export const listenShopSettings = (callback) =>
  onSnapshot(doc(db, 'settings', 'shop'), (snapshot) => callback(snapshot.exists() ? snapshot.data() : DEFAULT_SETTINGS));

export const updateShopSettings = (settings) => setDoc(doc(db, 'settings', 'shop'), settings, { merge: true });

export const fetchDeliveryZones = async () => {
  const snapshot = await getDocs(collection(db, 'delivery_zones'));
  const zones = snapshot.docs.map(withId);
  return zones.length ? zones : DELIVERY_ZONES;
};

export const saveDeliveryZone = async (zone) => {
  if (zone.id) {
    await setDoc(doc(db, 'delivery_zones', zone.id), zone, { merge: true });
    return zone.id;
  }
  const ref = await addDoc(collection(db, 'delivery_zones'), zone);
  return ref.id;
};

export const deleteDeliveryZone = (id) => deleteDoc(doc(db, 'delivery_zones', id));

export const createOrder = async (order) => {
  const ref = await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
};

export const listenCustomerOrders = (customerId, callback) => {
  const q = query(collection(db, 'orders'), where('customerId', '==', customerId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(withId)));
};

export const listenAllOrders = (callback) => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(withId)));
};

export const updateOrderStatus = (id, orderStatus) =>
  updateDoc(doc(db, 'orders', id), { orderStatus, updatedAt: serverTimestamp() });

export const fetchCustomers = async () => {
  const snapshot = await getDocs(query(collection(db, 'customers'), orderBy('createdAt', 'desc')));
  return snapshot.docs.map(withId);
};
