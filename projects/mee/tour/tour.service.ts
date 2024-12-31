import { inject, InjectionToken } from '@angular/core';
import { MeeTourService } from '@meeui/adk/tour';

export const TourService = new InjectionToken<MeeTourService>('TourService', {
  providedIn: 'root',
  factory: () => inject(MeeTourService),
});
