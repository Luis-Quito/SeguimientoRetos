
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner
} from '@ionic/angular';

import { RetosService, Reto } from '../../services/retos';
import {
  TareasService,
  TareaSemanal
} from '../../services/tareas';

@Component({
  selector: 'app-retos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner
  ],
  templateUrl: './retos.html',
  styleUrl: './retos.scss'
})
export class Retos implements OnInit {

  private retosService = inject(RetosService);
  private tareasService = inject(TareasService);
  private cdr = inject(ChangeDetectorRef);

  retos: Reto[] = [];
  tareas: TareaSemanal[] = [];

  busqueda = '';

  cargando = true;
  cargandoTareas = true;

  error = '';
  errorTareas = '';

  ngOnInit(): void {
    this.cargarRetos();
    this.cargarTareas();
  }

  cargarRetos(): void {
    this.cargando = true;
    this.error = '';

    this.retosService.obtenerRetos().subscribe({
      next: (respuesta) => {
        this.retos = respuesta.results;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar retos:', error);
        this.error = 'No se pudieron cargar los retos.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarTareas(): void {
    this.cargandoTareas = true;
    this.errorTareas = '';

    this.tareasService.obtenerTareas().subscribe({
      next: (respuesta) => {
        this.tareas = respuesta;
        this.cargandoTareas = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar tareas:', error);
        this.errorTareas =
          'No se pudieron cargar las tareas semanales.';
        this.cargandoTareas = false;
        this.cdr.detectChanges();
      }
    });
  }

  get retosFiltrados(): Reto[] {
    const texto = this.busqueda.toLowerCase().trim();

    return this.retos.filter(reto =>
      reto.titulo.toLowerCase().includes(texto) ||
      reto.descripcion.toLowerCase().includes(texto)
    );
  }

  tareasDeReto(retoId: number): TareaSemanal[] {
    return this.tareas.filter(
      tarea => tarea.reto === retoId
    );
  }
}
