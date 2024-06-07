import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'examples',
    loadComponent: () =>
      import('./examples/main.component').then((m) => m.Theme1Component),
  },
  // {
  //   path: 'game',
  //   loadComponent: () =>
  //     import('./wordpower.component').then((m) => m.WordPowerComponent),
  // },
  {
    path: 'ui',
    loadChildren: () => import('./ui/ui.routes').then((m) => m.UI_ROUTES),
  },
  // {
  //   path: 'chat',
  //   loadChildren: () => import('./chat/chat.routes').then((m) => m.CHAT_ROUTES),
  // },
  // {
  //   path: 'x',
  //   loadChildren: () => import('./x/x.routes').then((m) => m.X_ROUTES),
  // },
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('./interview/interview.routes').then((m) => m.INTERVIEW_ROUTES),
  // },
  {
    path: '',
    redirectTo: 'examples',
    pathMatch: 'full',
  },
];
