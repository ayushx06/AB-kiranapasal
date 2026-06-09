export const calculateDeliveryCharge = (distanceKm, orderTotal, settings) => {
  if (!settings) return 0;
  if (orderTotal >= Number(settings.freeDeliveryAbove || 0)) return 0;
  return Math.ceil(Number(distanceKm || 0) * Number(settings.deliveryChargePerKm || 0));
};

export const getZoneCharge = (zone, orderTotal, settings) => {
  if (!zone) return 0;
  if (orderTotal >= Number(settings?.freeDeliveryAbove || 0)) return 0;
  return Number(zone.charge || calculateDeliveryCharge(zone.distanceKm, orderTotal, settings));
};
