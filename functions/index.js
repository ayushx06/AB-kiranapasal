import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import admin from 'firebase-admin';

admin.initializeApp();

export const onOrderCreated = onDocumentCreated('orders/{orderId}', async (event) => {
  const order = event.data?.data();
  if (!order?.customerId) return;
  const customerRef = admin.firestore().collection('customers').doc(order.customerId);
  await customerRef.set(
    {
      phone: order.customerPhone || '',
      name: order.customerName || '',
      totalOrders: admin.firestore.FieldValue.increment(1),
      totalSpent: admin.firestore.FieldValue.increment(Number(order.total || 0)),
      lastOrderAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );
});

export const onOrderStatusUpdated = onDocumentUpdated('orders/{orderId}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after || before.orderStatus === after.orderStatus) return;
  await admin.firestore().collection('order_events').add({
    orderId: event.params.orderId,
    from: before.orderStatus,
    to: after.orderStatus,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
});
