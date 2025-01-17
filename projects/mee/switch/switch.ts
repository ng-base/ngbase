import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeSwitch, MeeSwitchLabel, MeeSwitchThumb, MeeSwitchTrack } from '@meeui/adk/switch';

@Component({
  selector: 'mee-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    { directive: MeeSwitch, inputs: ['checked', 'disabled'], outputs: ['checkedChange', 'change'] },
  ],
  imports: [MeeSwitchTrack, MeeSwitchLabel, MeeSwitchThumb],
  template: `
    <button
      meeSwitchTrack
      class="relative w-b9 rounded-full border-b0.5 border-transparent bg-muted-background transition-colors aria-[checked=true]:bg-primary"
    >
      <span
        #thumb="meeSwitchThumb"
        meeSwitchThumb
        [class]="thumb.checked() ? (thumb.rtl() ? '-translate-x-full' : 'translate-x-full') : ''"
        class="block h-b4 w-b4 rounded-full bg-foreground shadow-sm transition-transform"
      ></span>
    </button>
    <label meeSwitchLabel><ng-content /></label>
  `,
  host: {
    class: 'inline-flex items-center gap-b2 py-b',
  },
})
export class Switch {}
