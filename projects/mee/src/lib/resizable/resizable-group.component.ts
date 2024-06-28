import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  contentChildren,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { Resizable } from './resizable.component';

@Component({
  selector: 'mee-resizable-group',
  standalone: true,
  template: `<ng-content select="mee-resizable"></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex w-full',
    '[class.flex-col]': "direction() === 'vertical'",
  },
})
export class ResizableGroup {
  el = inject<ElementRef<HTMLElement>>(ElementRef);
  panels = contentChildren(Resizable);
  direction = input<'horizontal' | 'vertical'>('horizontal');

  constructor() {
    effect(
      () => {
        const panels = this.panels();
        const _ = this.direction();

        untracked(() => {
          panels.forEach((panel, index) => {
            panel.index = index;
            // hide the last panel's drag handle
            panel.draggable.set(true);
            if (index === panels.length - 1) {
              panel.draggable.set(false);
            }
            panel.handleDrag(undefined, false);
          });
          this.setAuto();
        });
      },
      { allowSignalWrites: true },
    );
  }

  get w() {
    return this.el.nativeElement.clientWidth;
  }

  get h() {
    return this.el.nativeElement.clientHeight;
  }

  setAuto() {
    const panels = this.panels();
    let str = 'calc(100%';
    const autos = [];
    for (const panel of panels) {
      if (panel.size() !== 'auto') {
        str += panel.str ? ` - ${panel.str}` : '';
      } else {
        autos.push(panel);
      }
    }
    str += ')';
    if (autos.length > 1) {
      str = `calc(${str} / ${autos.length})`;
    }
    for (const auto of autos) {
      auto.updateElementSize(str);
    }
  }
}
