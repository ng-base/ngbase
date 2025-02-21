import { HTTP_INTERCEPTORS, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { injectNetwork } from './network.service';
import { isClient } from '@ngbase/adk/utils';

const networkInterceptor: HttpInterceptorFn = (req, next) => {
  const networkService = injectNetwork();
  const isBrowser = isClient();

  if (isBrowser && !networkService.isOnline()) {
    throw 'No internet connection';
  }

  return next(req).pipe(
    catchError(error => {
      if (isBrowser && !networkService.isOnline()) {
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
