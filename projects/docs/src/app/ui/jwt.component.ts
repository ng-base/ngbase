import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocCode } from './code.component';

@Component({
  selector: 'app-jwt',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocCode],
  template: `
    <div>
      <h1>JWT</h1>
      <app-doc-code [tsCode]="tsCode" [adkCode]="adkCode"> </app-doc-code>
    </div>
  `,
})
export default class JwtComponent {
  tsCode = `
  import { provideJwt } from '@meeui/adk/jwt';

  export const appConfig: ApplicationConfig = {
    providers: [
        provideJwt(() => ({ 
            tokenGetter: () => localStorage.getItem('auth_token'),
        })),
    ],
  };

  @Injectable()
  export class AuthService {
    readonly jwtService = inject(JwtService);

    getToken() {
      return this.jwtService.getToken();
    }
  }
  `;

  adkCode = `
  @Injectable()
  export class JwtService<T> {
    getToken(): string | null;

    isTokenExpired(token?: string): boolean;

    decodeToken(token?: string): T | null;

    getTokenExpirationDate(token?: string): Date | null;
  }
  `;
}
