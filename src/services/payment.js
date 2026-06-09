export const startEsewaPayment = ({ amount, orderId }) => {
  const merchantId = import.meta.env.VITE_ESEWA_MERCHANT_ID;
  const params = new URLSearchParams({
    amt: amount,
    psc: 0,
    pdc: 0,
    txAmt: 0,
    tAmt: amount,
    pid: orderId,
    scd: merchantId,
    su: `${window.location.origin}/orders/${orderId}?payment=success`,
    fu: `${window.location.origin}/orders/${orderId}?payment=failed`
  });
  window.location.href = `https://esewa.com.np/epay/main?${params.toString()}`;
};

export const startKhaltiPayment = ({ amount, orderId }) => {
  const publicKey = import.meta.env.VITE_KHALTI_PUBLIC_KEY;
  if (!window.KhaltiCheckout) {
    throw new Error('Khalti SDK is not loaded.');
  }
  const checkout = new window.KhaltiCheckout({
    publicKey,
    productIdentity: orderId,
    productName: 'Abhishek Kirana Pasal Order',
    eventHandler: {
      onSuccess: () => window.location.assign(`/orders/${orderId}?payment=success`),
      onError: () => window.location.assign(`/orders/${orderId}?payment=failed`)
    }
  });
  checkout.show({ amount: Math.round(amount * 100) });
};
