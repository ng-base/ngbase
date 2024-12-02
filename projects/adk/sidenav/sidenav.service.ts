import { Injectable, Signal, signal } from '@angular/core';

export type ModeType = 'side' | 'over';

@Injectable()
export class SidenavService {
  readonly visibility = signal(1);
  show = signal(false);
  width!: Signal<string>;
  mode!: Signal<ModeType>;

  animationDone() {
    this.visibility.set(this.show() ? 1 : 0);
  }

  animationStart() {
    this.visibility.set(1);
  }
}
