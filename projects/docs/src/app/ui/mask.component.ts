import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocCode } from './code.component';
import { MaskInput, MaskPipe } from '@meeui/utils';
import { Heading } from '@meeui/typography';
import { Input } from '@meeui/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-mask',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocCode, Input, MaskInput, MaskPipe, Heading, FormsModule, ReactiveFormsModule],
  template: `
    <h1 meeHeader class="mb-5" id="maskPage">Mask</h1>

    <app-doc-code>
      <div class="grid grid-cols-2">
        <h4>Mask Input: '**/*#/#*##' {{ maskValue }}</h4>
        <input type="text" meeInput [meeMask]="'**/*#/#*##'" [(ngModel)]="maskValue" />
        <!-- [formControl]="formControl" -->

        <h4>Mask Input: 0000.M0.d0</h4>
        <input type="text" meeInput [meeMask]="'####.##.##'" />

        <h4>Mask Input: (000) 000-0000 ext. 000000</h4>
        <input type="text" meeInput [meeMask]="'(###) ###-#### ext. ######'" />

        <h4>Mask Input: 0000 0000 0000 0000</h4>
        <input type="text" meeInput [meeMask]="'#### #### #### ####'" />

        <h4>Mask Input: 00:00 AM</h4>
        <input type="text" meeInput [meeMask]="'##:##'" />
      </div>
    </app-doc-code>
  `,
})
export class MaskComponent {
  maskValue = '1022';
  formControl = new FormControl('10');
}
