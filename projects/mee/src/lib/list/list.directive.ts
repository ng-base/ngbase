import {
  Directive,
  OnDestroy,
  afterNextRender,
  contentChildren,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { List } from './list.component';
import { DOCUMENT } from '@angular/common';

@Directive({
  standalone: true,
  selector: '[meeListStyle]',
  host: {
    class:
      'flex items-center gap-b2 py-b2 px-b2 hover:bg-muted-background cursor-pointer rounded-md text-left data-[focus="true"]:bg-muted-background',
  },
})
export class ListStyle {}

@Directive({
  standalone: true,
  selector: '[meeActionGroup]',
})
export class ListActionGroup implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  readonly options = contentChildren(List, { descendants: true });

  private readonly activeIndex = signal<List | undefined>(undefined);
  private readonly optionsMap = new WeakMap<List, number>();

  constructor() {
    afterNextRender(() => {
      this.document.addEventListener('keydown', this.handleKeyDown);
      this.afterAction();
    });

    effect(
      () => {
        const _ = this.options();
        _.forEach((x, i) => this.optionsMap.set(x, i));
        untracked(() => {
          const lastIndex = this.activeIndex();
          this.activeIndex.set(_[0]);
          this.afterAction(lastIndex);
        });
      },
      { allowSignalWrites: true },
    );
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    const options = this.options();
    const lastIndex = this.activeIndex();
    const i = this.optionsMap.get(this.activeIndex() || options[0])!;
    if (event.key === 'ArrowDown') {
      this.activeIndex.set(options[Math.min(i + 1, options.length - 1)]);
    } else if (event.key === 'ArrowUp') {
      this.activeIndex.set(options[Math.max(i - 1, 0)]);
    } else if (event.key === 'Enter') {
      lastIndex?.select();
    }
    if (lastIndex !== this.activeIndex()) {
      event.preventDefault();
      this.afterAction(lastIndex);
    }
  };

  private afterAction(lastIndex?: List) {
    const option = this.activeIndex();
    lastIndex?.unselect();
    if (option) {
      option.focus();
    }
  }

  ngOnDestroy() {
    this.document.removeEventListener('keydown', this.handleKeyDown);
  }
}
