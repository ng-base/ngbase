import { Routes } from '@angular/router';
import { ColorsComponent } from './colors.component';

export const routes: Routes = [
  { path: 'colors', component: ColorsComponent },
  { path: '', redirectTo: 'colors', pathMatch: 'full' },
];
