import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { fadeAnimation } from '../dialog/dialog.animation';

export type ModeType = 'side' | 'over';

@Component({
  standalone: true,
  selector: 'mee-sidenav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (mode() === 'over' && show()) {
      <div
        [@fadeAnimation]
        class="absolute left-0 top-0 z-p h-full w-full bg-black/70"
        (click)="toggle()"
      ></div>
    }
    <ng-content select="mee-sidenav-header" />
    <ng-content />
  `,
  host: {
    class: 'flex w-full overflow-hidden relative top-0 left-0 h-full',
  },
  animations: [fadeAnimation('500ms')],
})
export class Sidenav {
  // Inputs
  readonly show = model(true);
  readonly mode = input<ModeType>('side');

  toggle() {
    this.show.update(show => !show);
  }
}
