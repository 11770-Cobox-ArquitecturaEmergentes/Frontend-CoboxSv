export type Incident = {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_review' | 'closed';
};
