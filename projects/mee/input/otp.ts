import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeInputOtp, MeeOtpInput, provideInputOtp } from '@meeui/adk/input';
import { RangePipe } from '@meeui/adk/utils';
import { InputStyle } from './input-style.directive';
import { injectDirectionality } from '@meeui/adk/bidi';

@Component({
  selector: 'mee-input-otp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideInputOtp(InputOtp)],
  imports: [InputStyle, RangePipe, MeeOtpInput],
  template: `
    @for (num of size(); track $index; let l = $last) {
      @for (n of num | range; track n; let i = $index; let ll = $last) {
        <input
          meeInputStyle
          meeOtpInput
          class="{{
            'mb-0 aspect-square w-10 rounded-none !px-0 text-center text-base font-semibold disabled:bg-muted-background/40 disabled:text-muted' +
              ((dir.isRtl() ? ll : i === 0) ? ' !rounded-l-lg' : '') +
              ((dir.isRtl() ? i === 0 : ll) ? ' !rounded-r-lg' : '')
          }}"
        />
      }
      @if (!l) {
        <div class="px-2">{{ separator() }}</div>
      }
    }
  `,
  host: {
    class: 'inline-flex items-center justify-center rounded-base',
  },
})
export class InputOtp extends MeeInputOtp {
  readonly dir = injectDirectionality();
}
