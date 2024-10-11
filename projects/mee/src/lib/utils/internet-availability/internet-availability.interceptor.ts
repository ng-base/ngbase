import { HTTP_INTERCEPTORS, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { InternetAvailabilityService } from './internet-availability.service';
import { inject } from '@angular/core';
import { isClient } from '../ssr';

const internetAvailabilityInterceptor: HttpInterceptorFn = (req, next) => {
  const internetAvailabilityService = inject(InternetAvailabilityService);
  const isBrowser = isClient();

  if (isBrowser && !internetAvailabilityService.isCurrentlyOnline()) {
    console.error('No internet connection');
    throw 'No internet connection';
  }

  return next(req).pipe(
    catchError(error => {
      if (isBrowser && !internetAvailabilityService.isCurrentlyOnline()) {
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
