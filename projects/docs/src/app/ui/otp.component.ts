import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Input, InputOtp, Label } from '@meeui/input';
import { FormsModule } from '@angular/forms';
import { DocCode } from './code.component';
import { MaskInput } from '@meeui/utils';

@Component({
  standalone: true,
  selector: 'app-otp',
  imports: [FormsModule, Heading, InputOtp, DocCode, MaskInput, Input, Label],
  template: `
    <h4 meeHeader class="mb-5" id="inputNumberPage">Input OTP</h4>

    <app-doc-code [tsCode]="tsCode">
      <label meeLabel>
        OTP: {{ otp }}
        <mee-input-otp placeholder="_" [size]="[4]" [(ngModel)]="otp" />
      </label>
      <label meeLabel class="mt-b4">
        Card: {{ otp1 }}
        <mee-input-otp [size]="[4, 4, 4]" [(ngModel)]="otp1" />
      </label>
    </app-doc-code>
  `,
})
export class OtpComponent {
  otp = '';
  otp1 = '';
  maskValue = '10';

  tsCode = `
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { InputOtp } from '@meeui/input';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [InputOtp, FormsModule],
    template: \`
      <mee-input-otp [size]="[4]" [(ngModel)]="otp"></mee-input-otp>

      <mee-input-otp [size]="[4, 4, 4]" [(ngModel)]="otp1"></mee-input-otp>
    \`,
  })
  export class AppComponent {
    otp = '';
  }
  `;
}
