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
  host: {
    role: 'list',
    '[class]': 'disabled() ? "pointer-events-none cursor-not-allowed opacity-50" : ""',
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
  // Dependencies
  readonly allyItem = inject(AccessibleItem);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  // Inputs
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
