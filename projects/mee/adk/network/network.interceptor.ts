import { HTTP_INTERCEPTORS, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { injectNetwork } from './network.service';
import { isClient } from '@meeui/ui/utils';

const networkInterceptor: HttpInterceptorFn = (req, next) => {
  const networkService = injectNetwork();
  const isBrowser = isClient();

  if (isBrowser && !networkService.isOnline()) {
    console.error('No internet connection');
    throw 'No internet connection';
  }

  return next(req).pipe(
    catchError(error => {
      if (isBrowser && !networkService.isOnline()) {
        console.error('Lost internet connection during request');
        // You can implement custom error handling here
      }
      throw error;
    }),
  );
};

export const provideNetworkInterceptor = () => ({
  provide: HTTP_INTERCEPTORS,
  useFactory: networkInterceptor,
  multi: true,
});
