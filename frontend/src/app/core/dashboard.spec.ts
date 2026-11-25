
import { Reto, TareaSemanal } from './modelos';

import {
  evaluarSemana,
  SemanaEvaluada
} from './semaforo';

import {
  calcularEstadisticasDashboard,
  obtenerDatosGrafico
} from './dashboard';

describe('Dashboard inteligente', () => {

  const hoy = '2026-11-25';

  const retos: Reto[] = [
    {
      id: 1,
      titulo: 'Leer 10 libros',
      descripcion: 'Leer durante el semestre',
      fecha_inicio: '2026-11-16',
      fecha_fin: '2026-12-31',
      estado: 'EN_CURSO',
      total_avances: 0,
      creado: '',
      actualizado: ''
    },
    {
      id: 2,
      titulo: 'Hacer ejercicio',
      descripcion: 'Ejercitarse semanalmente',
      fecha_inicio: '2026-11-23',
      fecha_fin: '2026-12-31',
      estado: 'EN_CURSO',
      total_avances: 0,
      creado: '',
      actualizado: ''
    }
  ];

  function crearSemana(
    id: number,
    reto: number,
    semana: number,
    inicio: string,
    fin: string,
    porcentaje: number
  ): SemanaEvaluada {

    const tarea: TareaSemanal = {
      id,
      reto,
      reto_titulo: reto === 1
        ? 'Leer 10 libros'
        : 'Hacer ejercicio',
      semana,
      fecha_inicio: inicio,
      fecha_fin: fin,
      descripcion: 'Meta semanal',
      porcentaje,
      actualizado: ''
    };

    return evaluarSemana(tarea, hoy);
  }

  const semanas: SemanaEvaluada[] = [
    crearSemana(
      1, 1, 7,
      '2026-11-16',
      '2026-11-22',
      0
    ),

    crearSemana(
      2, 1, 8,
      '2026-11-23',
      '2026-11-29',
      50
    ),

    crearSemana(
      3, 2, 8,
      '2026-11-23',
      '2026-11-29',
      30
    ),

    crearSemana(
      4, 2, 9,
      '2026-11-30',
      '2026-12-06',
      0
    )
  ];

  it('debe contar correctamente los retos', () => {

    const resultado =
      calcularEstadisticasDashboard(
        retos,
        semanas
      );

    expect(resultado.totalRetos).toBe(2);
    expect(resultado.retosActivos).toBe(2);

  });

  it('debe identificar las semanas rojas', () => {

    const resultado =
      calcularEstadisticasDashboard(
        retos,
        semanas
      );

    expect(resultado.semanasRojas).toBe(1);
    expect(resultado.semanasEnCurso).toBe(2);
    expect(resultado.semanasPendientes).toBe(1);

  });

  it('debe calcular el promedio sin semanas futuras', () => {

    const resultado =
      calcularEstadisticasDashboard(
        retos,
        semanas
      );

    // Promedio de 0, 50 y 30.
    // La semana futura no participa.
    expect(
      resultado.cumplimientoPromedio
    ).toBe(27);

  });

  it('debe mostrar solamente las semanas del reto seleccionado', () => {

    const grafico = obtenerDatosGrafico(
      semanas,
      2
    );

    expect(grafico.length).toBe(2);

    expect(grafico[0].semana).toBe(8);
    expect(grafico[0].porcentaje).toBe(30);
    expect(grafico[0].estado).toBe('ABIERTA');

    expect(grafico[1].semana).toBe(9);
    expect(grafico[1].porcentaje).toBe(0);
    expect(grafico[1].estado).toBe('PENDIENTE');

  });

  it('debe generar un mensaje cuando hay semanas rojas', () => {

    const resultado =
      calcularEstadisticasDashboard(
        retos,
        semanas
      );

    expect(resultado.mensaje).toContain(
      '1 semana(s) en rojo'
    );

  });

});
