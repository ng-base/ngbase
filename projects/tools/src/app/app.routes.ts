import { Routes } from '@angular/router';
import { ColorsComponent } from './colors.component';
import { SvgViewerComponent } from './svg-viewer.component';

export const routes: Routes = [
  { path: 'colors', component: ColorsComponent },
  { path: 'svgviewer', component: SvgViewerComponent },
  { path: '', redirectTo: 'colors', pathMatch: 'full' },
];
