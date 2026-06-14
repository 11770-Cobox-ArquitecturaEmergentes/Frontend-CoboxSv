export type Driver = {
  id: string;
  name: string;
  status: 'available' | 'assigned' | 'offline';
};
