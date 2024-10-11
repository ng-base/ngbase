import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  contentChild,
  input,
  model,
} from '@angular/core';
import { SidenavHeader } from './sidenav-header';
import { fadeAnimation } from '../dialog/dialog.animation';

@Component({
  standalone: true,
  selector: 'mee-sidenav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (mode() === 'over' && show()) {
      <div
        [@fadeAnimation]
        class="absolute left-0 top-0 z-p h-full w-full bg-black/40"
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
  // Dependencies
  readonly header = contentChild(SidenavHeader, { read: ElementRef });

  // Inputs
  readonly show = model(true);
  readonly mode = input<'side' | 'over'>('side');

  // State
  readonly headerWidth = computed(() => this.header()?.nativeElement.offsetWidth || 0);
  readonly left = computed(() => (this.show() ? this.headerWidth() : 0));

  constructor() {}

  toggle() {
    this.show.update(show => !show);
  }
}
