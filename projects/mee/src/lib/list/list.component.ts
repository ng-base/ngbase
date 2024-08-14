import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { ListStyle } from './list.directive';
import { AccessibleItem } from '../a11y';

@Component({
  selector: 'mee-list, [meeList]',
  standalone: true,
  template: ` <ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host[disabled] {
      @apply pointer-events-none cursor-not-allowed text-gray-400;
    }
  `,
  host: {
    role: 'list',
    '[attr.aria-disabled]': 'disabled()',
  },
  hostDirectives: [
    ListStyle,
    {
      directive: AccessibleItem,
      inputs: ['role', 'disabled', 'ayId'],
    },
  ],
})
export class List {
  readonly allyItem = inject(AccessibleItem);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly disabled = input(false, { transform: booleanAttribute });

  setAyId(id: string) {
    this.allyItem.ayId.set(id);
  }

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
