export type Order = {
  id: string;
  code: string;
  status: 'pending' | 'in_transit' | 'delivered';
};
