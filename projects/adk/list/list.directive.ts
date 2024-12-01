import {
  Directive,
  afterNextRender,
  contentChildren,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { documentListener } from '@meeui/adk/utils';
import { MeeList } from './list';

@Directive({
  selector: '[meeActionGroup]',
})
export class MeeListActionGroup {
  readonly options = contentChildren(MeeList, { descendants: true });

  private readonly activeIndex = signal<MeeList | undefined>(undefined);
  private readonly optionsMap = new WeakMap<MeeList, number>();

  constructor() {
    documentListener('keydown', this.handleKeyDown);
    afterNextRender(() => this.afterAction());

    effect(() => {
      const options = this.options();
      options.forEach((x, i) => this.optionsMap.set(x, i));
      untracked(() => {
        const lastIndex = this.activeIndex();
        this.activeIndex.set(options[0]);
        this.afterAction(lastIndex);
      });
    });
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

  private afterAction(lastIndex?: MeeList) {
    const option = this.activeIndex();
    lastIndex?.unselect();
    option?.focus();
  }
}
