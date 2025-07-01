// Definiciones de tipos para establecimientos
export const ESTABLISHMENT_STATUSES = {
  AVAILABLE: 'Disponible',
  OCCUPIED: 'Ocupado',
  RESERVED: 'Reservado',
  OUT_OF_ORDER: 'Fuera de Servicio'
};

export const establishType = {
  id: Number,
  name: String,
  address: String,
  latitude: Number,
  longitude: Number,
  status: String,
  floors: Array
};