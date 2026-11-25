
import { Reto } from './modelos';
import { SemanaEvaluada } from './semaforo';

export interface EstadisticasDashboard {
  totalRetos: number;
  retosActivos: number;
  retosCompletados: number;
  totalSemanas: number;
  semanasRojas: number;
  semanasAmarillas: number;
  semanasVerdes: number;
  semanasEnCurso: number;
  semanasPendientes: number;
  cumplimientoPromedio: number;
  mensaje: string;
}

export interface DatoGraficoSemanal {
  semana: number;
  porcentaje: number;
  estado: string;
  color: string;
}

export function calcularEstadisticasDashboard(
  retos: Reto[],
  semanas: SemanaEvaluada[]
): EstadisticasDashboard {

  const totalRetos = retos.length;

  const retosActivos = retos.filter(
    reto => reto.estado === 'EN_CURSO'
  ).length;

  const retosCompletados = retos.filter(
    reto => reto.estado === 'COMPLETADO'
  ).length;

  const semanasRojas = semanas.filter(
    semana => semana.semaforo === 'ROJO'
  ).length;

  const semanasAmarillas = semanas.filter(
    semana => semana.semaforo === 'AMARILLO'
  ).length;

  const semanasVerdes = semanas.filter(
    semana => semana.semaforo === 'VERDE'
  ).length;

  const semanasEnCurso = semanas.filter(
    semana => semana.semaforo === 'ABIERTA'
  ).length;

  const semanasPendientes = semanas.filter(
    semana => semana.semaforo === 'PENDIENTE'
  ).length;

  // No incluimos las semanas futuras en el promedio.
  const semanasIniciadas = semanas.filter(
    semana => semana.semaforo !== 'PENDIENTE'
  );

  const sumaPorcentajes = semanasIniciadas.reduce(
    (total, semana) => total + semana.porcentaje,
    0
  );

  const cumplimientoPromedio =
    semanasIniciadas.length > 0
      ? Math.round(
          sumaPorcentajes / semanasIniciadas.length
        )
      : 0;

  let mensaje = '';

  if (totalRetos === 0) {
    mensaje = 'Crea tu primer reto para comenzar.';
  } else if (semanasIniciadas.length === 0) {
    mensaje = 'Tus retos están registrados. El seguimiento aún no comienza.';
  } else if (semanasRojas > 0) {
    mensaje =
      `Tienes ${semanasRojas} semana(s) en rojo. ` +
      'Revisa los retos que necesitan más atención.';
  } else if (cumplimientoPromedio >= 80) {
    mensaje =
      'Tu avance es alto. Mantén la constancia para alcanzar tus metas.';
  } else if (cumplimientoPromedio >= 50) {
    mensaje =
      'Vas progresando. Revisa qué puedes mejorar esta semana.';
  } else {
    mensaje =
      'Tu avance todavía es bajo. Organiza pequeñas actividades para mejorar.';
  }

  return {
    totalRetos,
    retosActivos,
    retosCompletados,
    totalSemanas: semanas.length,
    semanasRojas,
    semanasAmarillas,
    semanasVerdes,
    semanasEnCurso,
    semanasPendientes,
    cumplimientoPromedio,
    mensaje
  };
}

export function obtenerDatosGrafico(
  semanas: SemanaEvaluada[],
  retoId: number
): DatoGraficoSemanal[] {

  const colores: Record<string, string> = {
    ROJO: '#dc3545',
    AMARILLO: '#ffc107',
    VERDE: '#28a745',
    ABIERTA: '#2563eb',
    PENDIENTE: '#9ca3af'
  };

  return semanas
    .filter(semana => semana.reto === retoId)
    .sort((a, b) => a.semana - b.semana)
    .map(semana => ({
      semana: semana.semana,
      porcentaje: semana.porcentaje,
      estado: semana.semaforo,
      color: colores[semana.semaforo]
    }));
}
