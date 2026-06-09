export const CATEGORIES = [
  { id: 'rice_dal_oil', label: 'Rice, Dal & Oil', labelNe: 'चामल, दाल र तेल', icon: '🌾' },
  { id: 'masala', label: 'Masala & Spices', labelNe: 'मसला र मसाला', icon: '🌶️' },
  { id: 'noodles_snacks', label: 'Noodles, Biscuits & Snacks', labelNe: 'नुडल्स र बिस्कुट', icon: '🍜' },
  { id: 'tea_sugar_salt', label: 'Tea, Sugar & Salt', labelNe: 'चिया, चिनी र नुन', icon: '🍵' },
  { id: 'household', label: 'Soap, Shampoo & Household', labelNe: 'साबुन र घरेलु सामान', icon: '🧼' },
  { id: 'drinks', label: 'Cold Drinks', labelNe: 'चिसो पेय', icon: '🥤' }
];

export const ORDER_STATUSES = ['pending', 'preparing', 'on_the_way', 'delivered', 'cancelled'];
export const PAYMENT_METHODS = ['cod', 'bank_transfer', 'esewa', 'khalti'];

export const STATUS_META = {
  pending: { label: 'Pending', labelNe: 'पेन्डिङ', className: 'bg-amber-100 text-amber-800' },
  preparing: { label: 'Preparing', labelNe: 'तयारी हुँदै', className: 'bg-blue-100 text-blue-800' },
  on_the_way: { label: 'On the way', labelNe: 'बाटोमा', className: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', labelNe: 'डेलिभर भयो', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', labelNe: 'रद्द भयो', className: 'bg-red-100 text-red-800' }
};

export const DEFAULT_SETTINGS = {
  isOpen: true,
  openTime: '06:00',
  closeTime: '21:00',
  deliveryChargePerKm: 35,
  freeDeliveryAbove: 2500,
  minOrderAmount: 300,
  bannerImages: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1600&q=80'
  ],
  announcementText: 'Fresh groceries delivered across Pokhara.',
  announcementTextNe: 'पोखराभर ताजा किराना छिटो डेलिभरी।',
  whatsappNumber: import.meta.env.VITE_SHOP_WHATSAPP || '+9779800000000',
  viberNumber: import.meta.env.VITE_SHOP_PHONE || '+9779800000000'
};

export const DELIVERY_ZONES = [
  { id: 'lakeside', name: 'Lakeside', nameNe: 'लेकसाइड', distanceKm: 4, charge: 140, estimatedMinutes: 35 },
  { id: 'mahendrapul', name: 'Mahendrapul', nameNe: 'महेन्द्रपुल', distanceKm: 2, charge: 80, estimatedMinutes: 25 },
  { id: 'chipledhunga', name: 'Chipledhunga', nameNe: 'चिप्लेढुंगा', distanceKm: 2.5, charge: 90, estimatedMinutes: 25 },
  { id: 'newroad', name: 'New Road', nameNe: 'न्यू रोड', distanceKm: 3, charge: 110, estimatedMinutes: 30 }
];

export const SAMPLE_PRODUCTS = [
  {
    id: 'basmati-rice-5kg',
    name: 'Basmati Rice 5kg',
    nameNe: 'बासमती चामल ५ किलो',
    description: 'Long-grain aromatic rice for daily meals and special occasions.',
    descriptionNe: 'दैनिक खाना र विशेष अवसरका लागि सुगन्धित लामो चामल।',
    category: 'rice_dal_oil',
    price: 650,
    originalPrice: 700,
    discountPercent: 7,
    unit: 'packet',
    stock: 50,
    lowStockThreshold: 10,
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80'],
    isPopular: true,
    isFeatured: true,
    isActive: true
  },
  {
    id: 'mustard-oil-1l',
    name: 'Mustard Oil 1L',
    nameNe: 'तोरीको तेल १ लिटर',
    description: 'Pure mustard oil with a bold Nepali kitchen aroma.',
    descriptionNe: 'नेपाली भान्साको सुगन्धसहित शुद्ध तोरीको तेल।',
    category: 'rice_dal_oil',
    price: 220,
    originalPrice: 220,
    discountPercent: 0,
    unit: 'bottle',
    stock: 30,
    lowStockThreshold: 10,
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80'],
    isPopular: true,
    isFeatured: true,
    isActive: true
  },
  {
    id: 'wai-wai-noodles',
    name: 'Wai Wai Noodles',
    nameNe: 'वाई वाई नुडल्स',
    description: 'Crunchy, quick and loved across Nepal.',
    descriptionNe: 'क्रन्ची, छिटो र नेपालभर मन पराइएको।',
    category: 'noodles_snacks',
    price: 25,
    originalPrice: 28,
    discountPercent: 10,
    unit: 'packet',
    stock: 200,
    lowStockThreshold: 20,
    images: ['https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=80'],
    isPopular: true,
    isFeatured: false,
    isActive: true
  },
  {
    id: 'ilam-tea-250g',
    name: 'Ilam Tea 250g',
    nameNe: 'इलाम चिया २५० ग्राम',
    description: 'Fresh black tea leaves from Ilam.',
    descriptionNe: 'इलामबाट आएको ताजा कालो चिया।',
    category: 'tea_sugar_salt',
    price: 180,
    originalPrice: 180,
    discountPercent: 0,
    unit: 'packet',
    stock: 40,
    lowStockThreshold: 8,
    images: ['https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=900&q=80'],
    isPopular: false,
    isFeatured: true,
    isActive: true
  },
  {
    id: 'lifebuoy-soap',
    name: 'Lifebuoy Soap',
    nameNe: 'लाइफबॉय साबुन',
    description: 'Daily hygiene soap for the whole family.',
    descriptionNe: 'सम्पूर्ण परिवारका लागि दैनिक सरसफाइ साबुन।',
    category: 'household',
    price: 45,
    originalPrice: 45,
    discountPercent: 0,
    unit: 'piece',
    stock: 100,
    lowStockThreshold: 20,
    images: ['https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&w=900&q=80'],
    isPopular: false,
    isFeatured: false,
    isActive: true
  },
  {
    id: 'coca-cola-500ml',
    name: 'Coca-Cola 500ml',
    nameNe: 'कोका-कोला ५०० मिलि',
    description: 'Chilled soft drink for meals and gatherings.',
    descriptionNe: 'खाना र भेटघाटका लागि चिसो पेय।',
    category: 'drinks',
    price: 80,
    originalPrice: 84,
    discountPercent: 5,
    unit: 'bottle',
    stock: 60,
    lowStockThreshold: 12,
    images: ['https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=900&q=80'],
    isPopular: true,
    isFeatured: false,
    isActive: true
  }
];
