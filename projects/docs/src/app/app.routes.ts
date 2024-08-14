import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: 'examples/:id',
  //   loadComponent: () => import('./examples/main.component').then(m => m.MainComponent),
  // },
  // {
  //   path: 'game',
  //   loadComponent: () =>
  //     import('./wordpower.component').then((m) => m.WordPowerComponent),
  // },
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
  // {
  //   path: '',
  //   redirectTo: 'examples/0',
  //   pathMatch: 'full',
  // },
];
