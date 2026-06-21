import { useState } from 'react';
import { Button, Dialog, Input } from '@/components/ui';
import { orderSchema } from '../validations';
import type { CreateOrderPayload } from '../types';

type OrderFormDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateOrderPayload) => void;
};

export function OrderFormDialog({ open, isSubmitting, onClose, onSubmit }: OrderFormDialogProps) {
  const [clientId, setClientId] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Perú');
  const [postalCode, setPostalCode] = useState('');
  const [lat, setLat] = useState('-12.046374');
  const [lng, setLng] = useState('-77.042793');
  const [notes, setNotes] = useState('');
  const [weight, setWeight] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const payloadRaw = {
      clientId: Number(clientId),
      addressLine,
      city,
      country,
      postalCode,
      referenceLatitude: Number(lat),
      referenceLongitude: Number(lng),
      notes,
      weightKg: Number(weight),
    };

    const result = orderSchema.safeParse(payloadRaw);
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? 'Datos inválidos');
      return;
    }

    setValidationError(null);
    onSubmit(result.data);
  };

  return (
    <Dialog open={open} title="Crear Orden de Entrega" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {validationError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-[#DC2626]">{validationError}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">ID del Cliente</label>
            <Input
              type="number"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Ej. 1"
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Peso (Kg)</label>
            <Input
              type="number"
              step="0.01"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ej. 12.5"
              className="mt-1"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Dirección</label>
          <Input
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            placeholder="Ej. Av. Primavera 120"
            className="mt-1"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Ciudad</label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ej. Lima"
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">País</label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Ej. Perú"
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Código Postal</label>
            <Input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Ej. 15001"
              className="mt-1"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Latitud de Referencia</label>
            <Input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Ej. -12.0463"
              className="mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Longitud de Referencia</label>
            <Input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="Ej. -77.0427"
              className="mt-1"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Notas / Descripción</label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Instrucciones especiales de entrega..."
            className="mt-1"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Crear Orden'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
