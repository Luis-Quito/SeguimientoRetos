
import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular';

import { SeguimientoService } from '../core/seguimiento.service';

import {
  calcularEstadisticasDashboard,
  obtenerDatosGrafico
} from '../core/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    RouterLink,
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
  ],

  styles: `
    .contenedor {
      max-width: 1000px;
      margin: 0 auto;
      padding: 14px;
    }

    .introduccion {
      margin-bottom: 18px;
    }

    .introduccion h2 {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .introduccion p {
      color: var(--ion-color-medium);
      font-size: 14px;
      line-height: 1.5;
    }

    .estadisticas {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .tarjeta {
      margin: 0;
      border-radius: 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .numero {
      font-size: 29px;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .descripcion {
      font-size: 13px;
      color: var(--ion-color-medium);
    }

    .azul {
      color: #2563eb;
    }

    .verde {
      color: #16844a;
    }

    .amarillo {
      color: #b77900;
    }

    .rojo {
      color: #d32f2f;
    }

    .mensaje {
      padding: 15px;
      border-left: 4px solid #2563eb;
      border-radius: 8px;
      background: #eaf3ff;
      color: #172b4d;
      font-size: 14px;
      line-height: 1.5;
      margin: 20px 0;
    }

    .mensaje p {
      margin-bottom: 0;
    }

    .titulo-seccion {
      font-size: 18px;
      font-weight: 700;
      margin: 22px 0 12px;
    }

    .selector-contenedor {
      margin: 15px 0 20px;
    }

    .selector-contenedor label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .selector-retos {
      width: 100%;
      min-height: 48px;
      padding: 10px 12px;
      background: var(--ion-background-color, #ffffff);
      color: var(--ion-text-color, #222222);
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      font-size: 15px;
    }

    .selector-retos:focus {
      border-color: #2563eb;
      outline: 2px solid rgba(37, 99, 235, 0.15);
    }

    .nombre-seleccionado {
      color: var(--ion-color-medium);
      font-size: 13px;
      margin-bottom: 16px;
    }

    .grafico {
      margin-top: 20px;
    }

    .fila-grafico {
      margin-bottom: 18px;
    }

    .info-grafico {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      margin-bottom: 7px;
    }

    .barra-fondo {
      background: #e5e7eb;
      width: 100%;
      height: 18px;
      border-radius: 8px;
      overflow: hidden;
    }

    .barra-valor {
      height: 100%;
      border-radius: 8px;
    }

    .leyenda {
      margin-top: 18px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 12px;
    }

    .leyenda-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .punto {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      display: inline-block;
    }

    .nota {
      font-size: 12px;
      color: var(--ion-color-medium);
      line-height: 1.5;
      margin-top: 15px;
    }

    .vacio {
      padding: 20px;
      text-align: center;
      color: var(--ion-color-medium);
    }

    @media (min-width: 700px) {
      .estadisticas {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
  `,

  template: `
    <ion-header>
      <ion-toolbar color="primary">

        <ion-buttons slot="start">
          <ion-back-button
            defaultHref="/retos">
          </ion-back-button>
        </ion-buttons>

        <ion-title>
          Panel de control inteligente
        </ion-title>

      </ion-toolbar>
    </ion-header>

    <ion-content>

      <div class="contenedor">

        <div class="introduccion">
          <h2>Mi progreso general</h2>

          <p>
            Consulta tus estadísticas y analiza
            cómo avanzan tus retos.
          </p>
        </div>

        @if (vista(); as datos) {

          <div class="estadisticas">

            <ion-card class="tarjeta">
              <ion-card-content>

                <div class="numero azul">
                  {{ datos.estadisticas.totalRetos }}
                </div>

                <div class="descripcion">
                  Retos registrados
                </div>

              </ion-card-content>
            </ion-card>

            <ion-card class="tarjeta">
              <ion-card-content>

                <div class="numero azul">
                  {{ datos.estadisticas.retosActivos }}
                </div>

                <div class="descripcion">
                  Retos en curso
                </div>

              </ion-card-content>
            </ion-card>

            <ion-card class="tarjeta">
              <ion-card-content>

                <div class="numero verde">
                  {{ datos.estadisticas.cumplimientoPromedio }}%
                </div>

                <div class="descripcion">
                  Cumplimiento promedio
                </div>

              </ion-card-content>
            </ion-card>

            <ion-card class="tarjeta">
              <ion-card-content>

                <div class="numero rojo">
                  {{ datos.estadisticas.semanasRojas }}
                </div>

                <div class="descripcion">
                  Semanas en rojo
                </div>

              </ion-card-content>
            </ion-card>

            <ion-card class="tarjeta">
              <ion-card-content>

                <div class="numero amarillo">
                  {{ datos.estadisticas.semanasAmarillas }}
                </div>

                <div class="descripcion">
                  Semanas en amarillo
                </div>

              </ion-card-content>
            </ion-card>

            <ion-card class="tarjeta">
              <ion-card-content>

                <div class="numero verde">
                  {{ datos.estadisticas.semanasVerdes }}
                </div>

                <div class="descripcion">
                  Semanas en verde
                </div>

              </ion-card-content>
            </ion-card>

          </div>

          <div class="mensaje">

            <strong>
              Análisis de tu progreso:
            </strong>

            <p>
              {{ datos.estadisticas.mensaje }}
            </p>

          </div>

          <h3 class="titulo-seccion">
            Gráfico de progreso semanal
          </h3>

          <div class="selector-contenedor">

            <label for="selector-reto">
              Seleccionar reto
            </label>

            <select
              id="selector-reto"
              class="selector-retos"
              [value]="datos.retoSeleccionado ?? ''"
              (change)="seleccionarReto(
                $any($event.target).value
              )">

              @for (reto of datos.retos; track reto.id) {

                <option [value]="reto.id">
                  {{ reto.titulo }} (ID {{ reto.id }})
                </option>

              }

            </select>

          </div>

          @if (datos.retoSeleccionado !== null) {

            <p class="nombre-seleccionado">

              Mostrando progreso de:

              <strong>
                {{ datos.nombreRetoSeleccionado }}
              </strong>

            </p>

            <div class="grafico">

              @for (dato of datos.grafico; track dato.semana) {

                <div class="fila-grafico">

                  <div class="info-grafico">

                    <span>
                      Semana {{ dato.semana }}
                    </span>

                    <strong>
                      {{ dato.porcentaje }}%
                    </strong>

                  </div>

                  <div class="barra-fondo">

                    <div
                      class="barra-valor"
                      [style.width.%]="dato.porcentaje"
                      [style.background-color]="dato.color">
                    </div>

                  </div>

                </div>

              } @empty {

                <p class="vacio">
                  Este reto todavía no tiene
                  semanas registradas.
                </p>

              }

            </div>

          } @else {

            <p class="vacio">
              Crea un reto para visualizar
              su progreso semanal.
            </p>

          }

          <div class="leyenda">

            <span class="leyenda-item">
              <span
                class="punto"
                style="background: #dc3545">
              </span>
              Roja
            </span>

            <span class="leyenda-item">
              <span
                class="punto"
                style="background: #ffc107">
              </span>
              Amarilla
            </span>

            <span class="leyenda-item">
              <span
                class="punto"
                style="background: #28a745">
              </span>
              Verde
            </span>

            <span class="leyenda-item">
              <span
                class="punto"
                style="background: #2563eb">
              </span>
              En curso
            </span>

            <span class="leyenda-item">
              <span
                class="punto"
                style="background: #9ca3af">
              </span>
              Pendiente
            </span>

          </div>

          <p class="nota">
            El cumplimiento promedio considera
            solamente las semanas que ya comenzaron.
            Las semanas futuras no se incluyen.
          </p>

          <ion-button
            expand="block"
            fill="outline"
            routerLink="/retos">

            Volver a mis retos

          </ion-button>

        }

      </div>

    </ion-content>
  `
})
export class DashboardPage {

  private readonly seguimiento =
    inject(SeguimientoService);

  // Los datos de Django se convierten en Signals.
  protected readonly retos = toSignal(
    this.seguimiento.retos$,
    { initialValue: [] }
  );

  protected readonly semanas = toSignal(
    this.seguimiento.semanas$,
    { initialValue: [] }
  );

  // Guarda el ID del reto que selecciona el usuario.
  private readonly retoElegido = signal<number | null>(null);

  // Calcula nuevamente la vista cuando cambian
  // los datos o el reto seleccionado.
  protected readonly vista = computed(() => {

    const retosActuales = this.retos();
    const semanasActuales = this.semanas();
    const seleccion = this.retoElegido();

    const retoSeleccionado =
      seleccion !== null &&
      retosActuales.some(reto => reto.id === seleccion)
        ? seleccion
        : (retosActuales[0]?.id ?? null);

    const retoActual = retosActuales.find(
      reto => reto.id === retoSeleccionado
    );

    const estadisticas =
      calcularEstadisticasDashboard(
        retosActuales,
        semanasActuales
      );

    const grafico =
      retoSeleccionado !== null
        ? obtenerDatosGrafico(
            semanasActuales,
            retoSeleccionado
          )
        : [];

    return {
      retos: retosActuales,
      retoSeleccionado,
      nombreRetoSeleccionado:
        retoActual?.titulo ?? 'Sin reto seleccionado',
      estadisticas,
      grafico
    };

  });

  protected seleccionarReto(valor: string): void {

    const id = Number(valor);

    if (
      Number.isInteger(id) &&
      this.retos().some(reto => reto.id === id)
    ) {
      this.retoElegido.set(id);
    }

  }
}
