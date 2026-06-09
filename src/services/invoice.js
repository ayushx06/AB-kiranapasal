import jsPDF from 'jspdf';
import { formatCurrency, formatDate } from '../utils/formatters';

export const generateInvoicePdf = (order, language = 'en') => {
  const doc = new jsPDF();
  const line = (label, value, y) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 16, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), 68, y);
  };

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Abhishek Kirana Pasal', 16, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Pokhara, Nepal', 16, 27);

  line('Invoice ID', order.id || order.orderId, 42);
  line('Date', formatDate(order.createdAt || new Date(), language), 50);
  line('Customer', order.customerName || order.deliveryAddress?.fullName || 'Customer', 58);
  line('Phone', order.customerPhone || order.deliveryAddress?.phone || '', 66);

  let y = 84;
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 16, y);
  doc.text('Qty', 118, y);
  doc.text('Total', 150, y);
  doc.setFont('helvetica', 'normal');
  y += 8;

  order.items?.forEach((item) => {
    doc.text(item.name, 16, y);
    doc.text(String(item.quantity), 120, y);
    doc.text(formatCurrency(item.price * item.quantity, language), 150, y);
    y += 8;
  });

  y += 8;
  line('Subtotal', formatCurrency(order.subtotal, language), y);
  line('Delivery', formatCurrency(order.deliveryCharge, language), y + 8);
  line('Discount', formatCurrency(order.discount || 0, language), y + 16);
  line('Grand Total', formatCurrency(order.total, language), y + 28);

  return doc;
};

export const downloadInvoice = (order, language = 'en') => {
  const doc = generateInvoicePdf(order, language);
  doc.save(`invoice-${order.id || order.orderId}.pdf`);
};
