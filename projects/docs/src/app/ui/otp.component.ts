import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocCode } from './code.component';
import { Heading } from '@meeui/ui/typography';
import { FormField, InputOtp, Label } from '@meeui/ui/input';

@Component({
  selector: 'app-otp',
  imports: [FormsModule, Heading, InputOtp, DocCode, FormField, Label],
  template: `
    <h4 meeHeader class="mb-5" id="inputNumberPage">Input OTP</h4>

    <app-doc-code [tsCode]="tsCode">
      <div class="flex flex-col items-start gap-b4">
        <div meeFormField>
          <label meeLabel>OTP: {{ otp }}</label>
          <mee-input-otp placeholder="_" [size]="[4]" [(ngModel)]="otp" mask />
        </div>
        <div meeFormField>
          <label meeLabel>Card: {{ otp1 }}</label>
          <mee-input-otp [size]="[4, 4, 4]" [(ngModel)]="otp1" />
        </div>
      </div>
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
  import { InputOtp } from '@meeui/ui/input';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [InputOtp, FormsModule],
    template: \`
      <mee-input-otp [size]="[4]" [(ngModel)]="otp" />

      <mee-input-otp [size]="[4, 4, 4]" [(ngModel)]="otp1" />
    \`,
  })
  export class AppComponent {
    otp = '';
  }
  `;
}
