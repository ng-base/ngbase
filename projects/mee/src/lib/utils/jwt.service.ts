import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { Observable } from 'rxjs';

// injectiontoken for getting the token
const JWT_OPTIONS = new InjectionToken<JwtOptions>('JWT_OPTIONS');

interface JwtOptions {
  tokenGetter: () => string | null | undefined;
}

export function provideJwt(options: () => JwtOptions) {
  return makeEnvironmentProviders([
    { provide: JWT_OPTIONS, useFactory: options },
    { provide: JwtInterceptor, useClass: JwtInterceptor },
  ]);
}

@Injectable({ providedIn: 'root' })
export class JwtService<T> {
  private tokenKey = 'auth_token';
  private options = inject(JWT_OPTIONS, { optional: true });

  getToken(): string | null {
    return this.options?.tokenGetter() ?? localStorage.getItem(this.tokenKey);
  }

  isTokenExpired(token?: string): boolean {
    const inputToken = token ?? this.getToken();
    if (!inputToken) return true;

    const expiry = this.getTokenExpirationDate(inputToken);
    return expiry ? expiry <= new Date() : true;
  }

  decodeToken(token?: string): T | null {
    const inputToken = token ?? this.getToken();
    if (!inputToken) return null;

    try {
      const payload = inputToken.split('.')[1];
      return JSON.parse(this.base64UrlDecode(payload));
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  getTokenExpirationDate(token?: string): Date | null {
    const decoded = this.decodeToken(token) as T extends { exp: number } ? T : null;
    if (!decoded || !decoded.exp) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  private base64UrlDecode(input: string): string {
    input = input.replace(/-/g, '+').replace(/_/g, '/');
    while (input.length % 4) {
      input += '=';
    }
    return atob(input);
  }
}

// jwt interceptor
@Injectable({ providedIn: 'root' })
export class JwtInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService<any>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.jwtService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    return next.handle(req);
  }
}
