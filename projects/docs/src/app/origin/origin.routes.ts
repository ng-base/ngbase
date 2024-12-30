import { Routes } from '@angular/router';

export const ORIGIN_ROUTES: Routes = [
  { path: 'slider', loadComponent: () => import('./slider-origin') },
  { path: '', redirectTo: 'slider', pathMatch: 'full' },
];

export default ORIGIN_ROUTES;
