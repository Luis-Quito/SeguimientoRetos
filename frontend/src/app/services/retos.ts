
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Capacitor } from '@capacitor/core';

export interface Reto {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  estado: string;
  total_avances: number;
}

export interface RespuestaRetos {
  count: number;
  next: string | null;
  previous: string | null;
  results: Reto[];
}

@Injectable({
  providedIn: 'root'
})
export class RetosService {
  private http = inject(HttpClient);

  private apiUrl = Capacitor.isNativePlatform()
    ? 'http://10.0.2.2:8000/api/retos/'
    : 'http://127.0.0.1:8000/api/retos/';

  obtenerRetos(): Observable<RespuestaRetos> {
    return this.http.get<RespuestaRetos>(this.apiUrl);
  }
}
