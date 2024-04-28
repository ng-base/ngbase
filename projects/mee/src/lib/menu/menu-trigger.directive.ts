import { Directive, ElementRef, inject, input } from '@angular/core';
import { popoverPortal } from '../popover';
import { Menu } from './menu.component';

@Directive({
  standalone: true,
  selector: '[meeMenuTrigger]',
  host: {
    '(click)': 'open()',
  },
})
export class MenuTrigger {
  meeMenuTrigger = input.required<Menu>();
  el = inject(ElementRef);
  popover = popoverPortal();
  close: () => void = () => {};

  open() {
    const menu = this.meeMenuTrigger();
    const { diaRef } = this.popover.open(
      menu.container()!,
      { target: this.el.nativeElement, position: 'bl' },
      { maxHeight: '400px' },
    );
    menu.diaRef = diaRef;
    this.close = diaRef.close;
  }
}
