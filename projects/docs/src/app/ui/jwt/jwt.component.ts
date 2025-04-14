import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocCode, getCode } from '../code.component';
import { Heading } from '@meeui/ui/typography';

@Component({
  selector: 'app-jwt',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocCode, Heading],
  template: `
    <h4 meeHeader="sm" class="mb-5">JWT</h4>
    <app-doc-code [tsCode]="tsCode()" [adkCode]="adkCode" hidePreview> </app-doc-code>
  `,
})
export default class JwtComponent {
  readonly tsCode = getCode('jwt/jwt-usage.ts');

  adkCode = `
  @Injectable()
  export class JwtService<T> {
    getToken(): string | null;

    isTokenExpired(token?: string): boolean;

    decodeToken(token?: string): T | null;

    getTokenExpirationDate(token?: string): Date | null;
  }
  `.trim();
}
