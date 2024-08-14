import { Component, OnInit } from '@angular/core';
import { Heading } from '@meeui/typography';
import { InputOtp } from '@meeui/input';
import { FormsModule } from '@angular/forms';
import { DocCode } from './code.component';
import { MaskInputComponent } from '@meeui/utils';

@Component({
  standalone: true,
  selector: 'app-otp',
  imports: [FormsModule, Heading, InputOtp, DocCode, MaskInputComponent],
  template: `
    <h4 meeHeader class="mb-5" id="inputNumberPage">Input OTP</h4>

    <app-doc-code [tsCode]="tsCode">
      <div>OTP: {{ otp }}</div>
      <mee-input-otp [size]="[4]" [(ngModel)]="otp"></mee-input-otp>
      <div class="mt-b4">Card: {{ otp1 }}</div>
      <mee-input-otp [size]="[4, 4, 4]" [(ngModel)]="otp1"></mee-input-otp>

      <div>
        <h4>Mask Input: '**/*#/#*##'</h4>
        <mee-mask-input [mask]="'**/*#/#*##'"></mee-mask-input>

        <h4>Mask Input: 0000.M0.d0</h4>
        <mee-mask-input [mask]="'####.##.##'"></mee-mask-input>

        <h4>Mask Input: (000) 000-0000 ext. 000000</h4>
        <mee-mask-input [mask]="'(###) ###-#### ext. ######'"></mee-mask-input>
      </div>
    </app-doc-code>
  `,
})
export class OtpComponent {
  otp = '';
  otp1 = '';

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
