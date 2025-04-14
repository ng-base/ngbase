import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { ApplicationConfig } from '@angular/core';
import { JwtService, provideJwt } from '@ngbase/adk/jwt';

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideJwt(() => ({
      tokenGetter: () => localStorage.getItem('auth_token'),
    })),
  ],
};

// auth.service.ts
@Injectable()
export class AuthService {
  readonly jwtService = inject(JwtService);

  getToken() {
    return this.jwtService.getToken();
  }

  isTokenExpired() {
    return this.jwtService.isTokenExpired();
  }

  decodeToken() {
    return this.jwtService.decodeToken();
  }
}
