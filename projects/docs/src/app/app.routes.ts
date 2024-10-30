import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'example/0',
    loadComponent: () => import('./examples/mail.component').then(m => m.MailComponent),
  },
  {
    path: 'example/1',
    loadComponent: () => import('./examples/playground.component').then(m => m.PlaygroundComponent),
  },
  {
    path: 'example/2',
    loadComponent: () => import('./examples/music.component').then(m => m.MusicComponent),
  },
  {
    path: 'example/3',
    loadComponent: () => import('./examples/forms.component').then(m => m.FormsComponent),
  },
  {
    path: 'example/4',
    loadComponent: () => import('./examples/inventory.component').then(m => m.InventoryComponent),
  },
  {
    path: 'example/5',
    loadComponent: () => import('./examples/sidebars.component').then(m => m.SidebarsComponent),
  },
  {
    path: '',
    loadChildren: () => import('./ui/ui.routes').then(m => m.UI_ROUTES),
  },
];
