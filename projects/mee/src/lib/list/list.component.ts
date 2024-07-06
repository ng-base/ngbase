import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { ListStyle } from './list.directive';

@Component({
  selector: 'mee-list, [meeList]',
  standalone: true,
  template: ` <ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host[disabled] {
      @apply cursor-not-allowed text-gray-400;
    }
  `,
  host: {
    role: 'list',
  },
  hostDirectives: [ListStyle],
})
export class List {
  el = inject<ElementRef<HTMLElement>>(ElementRef);

  select() {
    this.el.nativeElement.click();
  }

  focus() {
    this.el.nativeElement.scrollIntoView({ block: 'nearest' });
    this.el.nativeElement.classList.add('bg-muted-background');
  }

  unselect() {
    this.el.nativeElement.classList.remove('bg-muted-background');
  }
}
