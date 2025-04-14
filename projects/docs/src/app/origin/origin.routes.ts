import { Routes } from '@angular/router';

export const ORIGIN_ROUTES: Routes = [
  { path: 'slider', loadComponent: () => import('./slider-origin') },
  { path: 'carousel', loadComponent: () => import('./carousel-origin') },
  { path: 'dropdown', loadComponent: () => import('./dropdown.ng') },
  { path: '', loadComponent: () => import('./origin.ng') },
];

export default ORIGIN_ROUTES;
