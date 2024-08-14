import { Routes } from '@angular/router';
import { ExamplesComponent } from './main.component';

export const EXAMPLE_ROUTES: Routes = [
  { path: ':id', component: ExamplesComponent },
  { path: '', redirectTo: '0', pathMatch: 'full' },
];
