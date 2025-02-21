import { inject, InjectionToken } from '@angular/core';
import { NgbTourService } from '@ngbase/adk/tour';

export const TourService = new InjectionToken<NgbTourService>('TourService', {
  providedIn: 'root',
  factory: () => inject(NgbTourService),
});
