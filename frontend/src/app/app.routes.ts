
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'retos',
    loadComponent: () =>
      import('./pages/retos/retos').then(m => m.Retos),
  },
  {
    path: '',
    redirectTo: 'retos',
    pathMatch: 'full',
  },
];
