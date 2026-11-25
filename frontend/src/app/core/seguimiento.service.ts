
import { Injectable, inject } from '@angular/core';

import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  scan,
  share,
  shareReplay,
  switchMap,
  tap,
  timer
} from 'rxjs';

import { Reto, TareaSemanal } from './modelos';

import {
  RetosApi,
  mensajeError
} from './retos-api.service';

import {
  ResumenReto,
  SemanaEvaluada,
  evaluarSemana,
  hoyIso,
  resumirPorReto
} from './semaforo';

export interface ResultadoGuardado {
  ok: boolean;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {

  private readonly api = inject(RetosApi);

  private readonly recargar$ =
    new BehaviorSubject<void>(undefined);

  readonly error$ =
    new BehaviorSubject<string | null>(null);

  // F1. Cargar los retos desde Django

  readonly retos$: Observable<Reto[]> =
    this.recargar$.pipe(
      switchMap(() =>
        this.api.listarRetos().pipe(
          tap(() => this.error$.next(null)),
          catchError(error => {
            this.error$.next(mensajeError(error));
            return of([] as Reto[]);
          })
        )
      ),
      shareReplay(1)
    );

  // F1. Cargar las tareas semanales

  private readonly tareas$: Observable<TareaSemanal[]> =
    this.recargar$.pipe(
      switchMap(() =>
        this.api.listarTareas().pipe(
          catchError(error => {
            this.error$.next(mensajeError(error));
            return of([] as TareaSemanal[]);
          })
        )
      ),
      shareReplay(1)
    );

  // F3. Comprobar la fecha cada minuto

  readonly hoy$: Observable<string> =
    timer(0, 60000).pipe(
      map(() => hoyIso()),
      distinctUntilChanged(),
      shareReplay(1)
    );

  // F4. Calcular el semáforo de cada semana

  readonly semanas$: Observable<SemanaEvaluada[]> =
    combineLatest([
      this.tareas$,
      this.hoy$
    ]).pipe(
      map(([tareas, hoy]) =>
        tareas.map(tarea =>
          evaluarSemana(tarea, hoy)
        )
      ),
      shareReplay(1)
    );

  // F4. Resumir los colores por reto

  readonly resumen$: Observable<Map<number, ResumenReto>> =
    this.semanas$.pipe(
      map(resumirPorReto),
      shareReplay(1)
    );

  // F5. Detectar las semanas cerradas en rojo

  readonly rojas$: Observable<SemanaEvaluada[]> =
    this.semanas$.pipe(
      map(semanas =>
        semanas.filter(
          semana => semana.semaforo === 'ROJO'
        )
      ),
      shareReplay(1)
    );

  // F5. Detectar semanas en riesgo

  readonly enRiesgo$: Observable<SemanaEvaluada[]> =
    this.semanas$.pipe(
      map(semanas =>
        semanas.filter(
          semana => semana.enRiesgo
        )
      ),
      shareReplay(1)
    );

  // F5. Contar todas las alertas

  readonly totalAlertas$: Observable<number> =
    combineLatest([
      this.rojas$,
      this.enRiesgo$
    ]).pipe(
      map(([rojas, riesgo]) =>
        rojas.length + riesgo.length
      ),
      distinctUntilChanged()
    );

  // F6. Avisar solamente de nuevas semanas rojas

  readonly nuevasRojas$: Observable<SemanaEvaluada[]> =
    this.rojas$.pipe(
      scan(
        (estado, rojas) => ({
          vistas: new Set(
            rojas.map(roja => roja.id)
          ),
          nuevas: rojas.filter(
            roja => !estado.vistas.has(roja.id)
          )
        }),
        {
          vistas: new Set<number>(),
          nuevas: [] as SemanaEvaluada[]
        }
      ),
      map(estado => estado.nuevas),
      filter(nuevas => nuevas.length > 0)
    );

  // F7. Guardar el porcentaje semanal

  private readonly cambios$ =
    new Subject<{
      tarea: SemanaEvaluada;
      porcentaje: number;
    }>();

  readonly guardado$: Observable<ResultadoGuardado> =
    this.cambios$.pipe(
      debounceTime(400),

      switchMap(({ tarea, porcentaje }) =>
        this.api.actualizarTarea(
          tarea.id,
          { porcentaje }
        ).pipe(
          map(() => ({
            ok: true,
            mensaje:
              `Semana ${tarea.semana}: ${porcentaje} % guardado.`
          })),

          catchError(error =>
            of({
              ok: false,
              mensaje: mensajeError(error)
            })
          )
        )
      ),

      tap(() => this.recargar()),
      share()
    );

  // Consultar las semanas de un reto

  semanasDeReto$(
    retoId: number
  ): Observable<SemanaEvaluada[]> {

    return this.semanas$.pipe(
      map(semanas =>
        semanas.filter(
          semana => semana.reto === retoId
        )
      )
    );
  }

  // Actualizar los datos de la aplicación

  recargar(): void {
    this.recargar$.next();
  }

  // Registrar un cambio de porcentaje

  cambiarPorcentaje(
    tarea: SemanaEvaluada,
    porcentaje: number
  ): void {

    this.cambios$.next({
      tarea,
      porcentaje
    });
  }
}
