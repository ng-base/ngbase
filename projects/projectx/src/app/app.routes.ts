import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page.component';
import { DashboardComponent } from './dashboard.component';
import { SummaryComponent } from './summary.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'admin', component: DashboardComponent },
  { path: 'summary', component: SummaryComponent },
];
