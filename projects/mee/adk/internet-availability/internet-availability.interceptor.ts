import { HTTP_INTERCEPTORS, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { InternetAvailability } from './internet-availability.service';
import { inject } from '@angular/core';
import { isClient } from '@meeui/ui/utils';

const internetAvailabilityInterceptor: HttpInterceptorFn = (req, next) => {
  const internetAvailabilityService = inject(InternetAvailability);
  const isBrowser = isClient();

  if (isBrowser && !internetAvailabilityService.isOnline()) {
    console.error('No internet connection');
    throw 'No internet connection';
  }

  return next(req).pipe(
    catchError(error => {
      if (isBrowser && !internetAvailabilityService.isOnline()) {
        console.error('Lost internet connection during request');
        // You can implement custom error handling here
      }
      throw error;
    }),
  );
};

export const provideInternetAvailabilityInterceptor = () => ({
  provide: HTTP_INTERCEPTORS,
  useFactory: internetAvailabilityInterceptor,
  multi: true,
});
