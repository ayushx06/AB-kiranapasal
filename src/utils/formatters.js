const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export const toDevanagariNumber = (value) =>
  String(value).replace(/\d/g, (digit) => devanagariDigits[Number(digit)]);

export const formatCurrency = (amount = 0, language = 'en') => {
  const formatted = new Intl.NumberFormat('en-NP', { maximumFractionDigits: 0 }).format(Number(amount) || 0);
  return language === 'ne' ? `रू ${toDevanagariNumber(formatted)}` : `NPR ${formatted}`;
};

export const formatDate = (value, language = 'en') => {
  if (!value) return language === 'ne' ? 'मिति छैन' : 'No date';
  const date = value?.toDate ? value.toDate() : new Date(value);
  const formatted = new Intl.DateTimeFormat('en-NP', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
  return language === 'ne' ? toDevanagariNumber(formatted) : formatted;
};

export const normalizeNepalPhone = (phone = '') => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('977')) return `+${digits}`;
  if (digits.length === 10) return `+977${digits}`;
  return phone.startsWith('+') ? phone : `+${digits}`;
};

export const getDiscountedPrice = (product) => {
  const price = Number(product?.price || 0);
  const discount = Number(product?.discountPercent || 0);
  return Math.round(price - (price * discount) / 100);
};
