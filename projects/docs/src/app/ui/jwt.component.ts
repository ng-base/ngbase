import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocCode } from './code.component';
import { Heading } from '@meeui/ui/typography';

@Component({
  selector: 'app-jwt',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocCode, Heading],
  template: `
    <h4 meeHeader="sm" class="mb-5">JWT</h4>
    <app-doc-code [tsCode]="tsCode" [adkCode]="adkCode" hidePreview> </app-doc-code>
  `,
})
export default class JwtComponent {
  tsCode = `
  import { provideJwt } from '@ngbase/adk/jwt';

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
