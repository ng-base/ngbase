import { Routes } from '@angular/router';
import { HomeComponent } from './json-view/home.component';
import { UiComponent } from './ui/ui.component';
import { UiTestComponent } from './ui-test.component';

export const routes: Routes = [
  {
    path: 'json-view',
    component: HomeComponent,
  },
  {
    path: 'ui',
    component: UiComponent,
  },
  {
    path: 'ui-test',
    component: UiTestComponent,
  },
  {
    path: '',
    redirectTo: 'ui',
    pathMatch: 'full',
  },
];
