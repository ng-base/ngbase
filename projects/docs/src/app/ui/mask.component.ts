import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Input } from '@meeui/ui/input';
import { MaskInput, MaskPipe } from '@meeui/ui/mask';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-mask',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocCode, Input, MaskInput, MaskPipe, Heading, FormsModule, ReactiveFormsModule],
  template: `
    <h1 meeHeader class="mb-5" id="maskPage">Mask</h1>

    <app-doc-code>
      <div class="grid grid-cols-2">
        <h4>Mask Input: '**/*#/#*##' {{ maskValue }}</h4>
        <input type="text" [meeMask]="'**/*#/#*##'" [(ngModel)]="maskValue" />
        <!-- [formControl]="formControl" -->

        <h4>Mask Input: 0000.M0.d0</h4>
        <input type="text" [meeMask]="'####.##.##'" />

        <h4>Mask Input: (000) 000-0000 ext. 000000 {{ ext() }}</h4>
        <input
          type="text"
          [meeMask]="'(###) ###-#### ext. ######'"
          [(ngModel)]="ext"
          (ngModelChange)="valueChange($event)"
        />

        <h4>Mask Input: 0000 0000 0000 0000</h4>
        <input type="text" [meeMask]="'#### #### #### ####'" />

        <h4>Mask Input: 00:00 AM</h4>
        <input type="text" [meeMask]="'##:##'" />

        <h4>Mask Input: 0000 0000 0000 0000</h4>
        {{ '1234567890123456' | mask: '(###) ###-#### ext. ######' }}
      </div>
    </app-doc-code>
  `,
})
export class MaskComponent {
  maskValue = '1022';
  formControl = new FormControl('10');

  ext = signal('');

  valueChange(value: string) {
    console.log('valueChange', value);
  }
}
