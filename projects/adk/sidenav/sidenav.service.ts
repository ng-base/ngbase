import { computed, Injectable, signal } from '@angular/core';
import { injectDirectionality } from '@meeui/adk/bidi';

export type SidenavType = 'side' | 'over' | 'partial';

@Injectable()
export class SidenavService {
  readonly dir = injectDirectionality();
  width = signal('0');
  show = signal(true);
  mode = signal<'side' | 'over' | 'partial'>('side');
  minWidth = signal('0');
  readonly status = signal(1);

  readonly visibility = computed(() => (this.mode() === 'partial' ? true : this.status()));
  readonly animate = computed(() => (this.mode() === 'partial' ? true : this.show()));

  readonly w = computed(() =>
    this.show() && this.mode() !== 'over'
      ? this.width()
      : this.mode() === 'partial'
        ? this.minWidth()
        : '0',
  );

  readonly styles = computed(() => {
    const styles = {} as any;
    if (this.dir.isRtl()) {
      styles.paddingRight = this.w();
    } else {
      styles.paddingLeft = this.w();
    }
    return styles;
  });

  animationDone() {
    this.status.set(this.show() ? 1 : 0);
  }

  animationStart() {
    this.status.set(1);
  }
}
