export interface Actividad {
  id?: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string; // formato 'YYYY-MM-DD'
  fechaFin: string;
  activa: boolean;
  vigente?: boolean;
}
