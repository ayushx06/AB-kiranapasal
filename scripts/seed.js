import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const seedProducts = [
  { name: 'Basmati Rice 5kg', nameNe: 'बासमती चामल ५ किलो', category: 'rice_dal_oil', price: 650, unit: 'packet', stock: 50, isPopular: true },
  { name: 'Mustard Oil 1L', nameNe: 'तोरीको तेल १ लिटर', category: 'rice_dal_oil', price: 220, unit: 'bottle', stock: 30, isPopular: true },
  { name: 'Wai Wai Noodles', nameNe: 'वाई वाई नुडल्स', category: 'noodles_snacks', price: 25, unit: 'packet', stock: 200, isPopular: true, discountPercent: 10 },
  { name: 'Ilam Tea 250g', nameNe: 'इलाम चिया २५० ग्राम', category: 'tea_sugar_salt', price: 180, unit: 'packet', stock: 40 },
  { name: 'Lifebuoy Soap', nameNe: 'लाइफबॉय साबुन', category: 'household', price: 45, unit: 'piece', stock: 100 },
  { name: 'Coca-Cola 500ml', nameNe: 'कोका-कोला ५०० मिलि', category: 'drinks', price: 80, unit: 'bottle', stock: 60, discountPercent: 5 }
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

await Promise.all(
  seedProducts.map((product) =>
    setDoc(doc(collection(db, 'products')), {
      description: `${product.name} from Abhishek Kirana Pasal.`,
      descriptionNe: `${product.nameNe} अभिषेक किराना पसलबाट।`,
      originalPrice: product.price,
      discountPercent: product.discountPercent || 0,
      lowStockThreshold: 10,
      images: ['https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=900&q=80'],
      isFeatured: false,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...product
    })
  )
);

await setDoc(doc(db, 'settings', 'shop'), {
  isOpen: true,
  openTime: '06:00',
  closeTime: '21:00',
  deliveryChargePerKm: 35,
  freeDeliveryAbove: 2500,
  minOrderAmount: 300,
  bannerImages: [],
  announcementText: 'Fresh groceries delivered across Pokhara.',
  announcementTextNe: 'पोखराभर ताजा किराना छिटो डेलिभरी।',
  whatsappNumber: process.env.VITE_SHOP_WHATSAPP || '+9779800000000',
  viberNumber: process.env.VITE_SHOP_PHONE || '+9779800000000'
});

console.log(`Seeded ${seedProducts.length} products.`);
