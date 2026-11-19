
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Capacitor } from '@capacitor/core';

export interface TareaSemanal {
  id: number;
  reto: number;
  reto_titulo: string;
  semana: number;
  fecha_inicio: string;
  fecha_fin: string;
  descripcion: string;
  porcentaje: number;
  actualizado: string;
}

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private http = inject(HttpClient);

  private apiUrl = Capacitor.isNativePlatform()
    ? 'http://10.0.2.2:8000/api/tareas/'
    : 'http://127.0.0.1:8000/api/tareas/';

  obtenerTareas(): Observable<TareaSemanal[]> {
    return this.http.get<TareaSemanal[]>(this.apiUrl);
  }
}
