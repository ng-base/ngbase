import {
  Directive,
  afterNextRender,
  contentChildren,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { documentListener } from '@ngbase/adk/utils';
import { NgbList } from './list';

@Directive({
  selector: '[ngbActionGroup]',
})
export class NgbListActionGroup {
  readonly options = contentChildren(NgbList, { descendants: true });

  private readonly activeIndex = signal<NgbList | undefined>(undefined);
  private readonly optionsMap = new WeakMap<NgbList, number>();

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

  private afterAction(lastIndex?: NgbList) {
    const option = this.activeIndex();
    lastIndex?.unselect();
    option?.focus();
  }
}
