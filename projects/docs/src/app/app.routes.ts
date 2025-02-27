import { Routes } from '@angular/router';
import { BaseComponent } from './ui/base.component';

export const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: '', loadComponent: () => import('./introduction.ng') },
      { path: 'docs', loadChildren: () => import('./ui/ui.routes') },
      { path: 'examples', loadChildren: () => import('./examples/example.routes') },
      { path: 'origin', loadChildren: () => import('./origin/origin.routes') },
    ],
  },
];
