import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./ui/ui.routes').then(m => m.UI_ROUTES),
  },
];
