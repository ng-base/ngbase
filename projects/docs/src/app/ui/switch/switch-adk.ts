import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbSwitch, NgbSwitchLabel, NgbSwitchThumb, NgbSwitchTrack } from '@ngbase/adk/switch';

@Component({
  selector: 'mee-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    { directive: NgbSwitch, inputs: ['checked', 'disabled'], outputs: ['checkedChange', 'change'] },
  ],
  imports: [NgbSwitchTrack, NgbSwitchLabel, NgbSwitchThumb],
  template: `
    <button
      ngbSwitchTrack
      class="relative h-b5 w-b9 rounded-full border-b0.5 border-transparent bg-muted-background transition-colors aria-[checked=true]:bg-primary"
    >
      <span
        #thumb="ngbSwitchThumb"
        ngbSwitchThumb
        [class]="thumb.checked() ? 'ltr:translate-x-full rtl:-translate-x-full' : ''"
        class="block h-b4 w-b4 rounded-full bg-foreground shadow-sm transition-transform"
      ></span>
    </button>
    <label ngbSwitchLabel><ng-content /></label>
  `,
  host: {
    class: 'inline-flex items-center gap-b2 py-b',
  },
})
export class Switch {}
