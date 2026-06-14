export type DeliveryRoute = {
  id: string;
  name: string;
  status: 'planned' | 'active' | 'completed';
};
