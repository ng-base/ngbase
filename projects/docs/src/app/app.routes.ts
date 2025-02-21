import { Routes } from '@angular/router';
import { BaseComponent } from './ui/base.component';

export const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./introduction.ng'),
      },
      {
        path: 'docs',
        loadChildren: () => import('./ui/ui.routes').then(m => m.UI_ROUTES),
      },
    ],
  },
];
