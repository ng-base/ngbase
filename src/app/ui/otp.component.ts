import { Component, OnInit } from '@angular/core';
import { Heading } from '@meeui/typography';
import { InputOtp } from '@meeui/input';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-otp',
  imports: [FormsModule, Heading, InputOtp],
  template: `
    <h4 meeHeader class="mb-5" id="inputNumberPage">Input OTP</h4>
    <div>Value: {{ otp }}</div>
    <mee-input-otp [size]="[4]" [(ngModel)]="otp"></mee-input-otp>
    <div>Value1: {{ otp1 }}</div>
    <mee-input-otp [size]="[4, 4, 4]" [(ngModel)]="otp1"></mee-input-otp>
  `,
})
export class OtpComponent implements OnInit {
  otp = '';
  otp1 = '';
  constructor() {}

  ngOnInit() {}
}
