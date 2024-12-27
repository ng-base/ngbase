import { Routes } from '@angular/router';
import { ExamplesComponent } from './main.component';

const EXAMPLE_ROUTES: Routes = [
  { path: 'example/0', loadComponent: () => import('./mail.component') },
  { path: 'example/1', loadComponent: () => import('./playground.component') },
  { path: 'example/2', loadComponent: () => import('./music.component') },
  { path: 'example/3', loadComponent: () => import('./forms.component') },
  { path: 'example/4', loadComponent: () => import('./inventory.component') },
  { path: 'example/5', loadComponent: () => import('./sidebars.component') },
  { path: ':id', component: ExamplesComponent },
  { path: '', redirectTo: '0', pathMatch: 'full' },
];

export default EXAMPLE_ROUTES;
