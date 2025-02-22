import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocCode } from './code.component';
import { Heading } from '@meeui/ui/typography';
import { InputOtp } from '@meeui/ui/form-field';
import { Checkbox } from '@meeui/ui/checkbox';

@Component({
  selector: 'app-otp',
  imports: [FormsModule, Heading, InputOtp, DocCode, Checkbox],
  template: `
    <h4 meeHeader class="mb-5" id="inputNumberPage">Input OTP</h4>

    <app-doc-code [tsCode]="tsCode">
      <div class="flex flex-col items-start gap-4">
        <div class="flex items-center gap-2">
          <mee-checkbox [(ngModel)]="disabled">Disabled</mee-checkbox>
          <mee-checkbox [(ngModel)]="masked">Masked</mee-checkbox>
        </div>
        <form #myForm="ngForm" (ngSubmit)="submit()">
          <label>OTP: {{ otp() }}</label>
          <mee-input-otp
            placeholder=""
            separator=""
            [size]="[1, 1, 1, 1]"
            [disabled]="disabled()"
            [(ngModel)]="otp"
            name="otp"
            [masked]="masked()"
          />

          <button type="submit">Submit</button>
        </form>
        <div>
          <label>Card: {{ otp1 }}</label>
          <mee-input-otp [size]="[4, 4, 4]" [(ngModel)]="otp1" />
        </div>
      </div>
    </app-doc-code>
  `,
})
export default class OtpComponent {
  otp = signal('');
  otp1 = '';
  maskValue = '10';

  readonly disabled = signal(false);
  readonly masked = signal(false);

  tsCode = `
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { InputOtp } from '@meeui/ui/input';

  @Component({
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

  submit() {
    console.log(this.otp());
    this.disabled.set(true);
  }
}
