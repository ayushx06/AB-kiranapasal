import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { normalizeNepalPhone } from '../utils/formatters';

export const listenToAuth = (callback) => onAuthStateChanged(auth, callback);

export const ensureCustomerProfile = async (user, extra = {}) => {
  if (!user) return null;
  const ref = doc(db, 'customers', user.uid);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    await setDoc(ref, {
      phone: user.phoneNumber || extra.phone || '',
      name: extra.name || '',
      email: user.email || null,
      totalOrders: 0,
      totalSpent: 0,
      addresses: [],
      isAdmin: false,
      createdAt: serverTimestamp(),
      lastOrderAt: null
    });
  }
  return getDoc(ref);
};

export const createRecaptcha = (containerId = 'recaptcha-container') => {
  if (window.recaptchaVerifier) return window.recaptchaVerifier;
  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
  return window.recaptchaVerifier;
};

export const sendPhoneOtp = async (phone) => {
  const verifier = createRecaptcha();
  return signInWithPhoneNumber(auth, normalizeNepalPhone(phone), verifier);
};

export const verifyPhoneOtp = async (confirmationResult, code) => {
  const result = await confirmationResult.confirm(code);
  await ensureCustomerProfile(result.user);
  return result.user;
};

export const adminEmailLogin = (email, password) => signInWithEmailAndPassword(auth, email, password);

export const getAdminStatus = async (uid) => {
  if (!uid) return false;
  const snapshot = await getDoc(doc(db, 'customers', uid));
  return snapshot.exists() && snapshot.data().isAdmin === true;
};

export const logoutUser = () => signOut(auth);
