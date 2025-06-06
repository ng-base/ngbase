import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  untracked,
} from '@angular/core';
import { uniqueId } from '@ngbase/adk/utils';
import { NgbResizable } from './resizable';

@Directive({
  selector: '[ngbResizableGroup]',
  exportAs: 'ngbResizableGroup',
  host: {
    '[attr.id]': 'id',
  },
})
export class NgbResizableGroup {
  readonly document = inject(DOCUMENT);
  readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly panels = contentChildren(forwardRef(() => NgbResizable));

  readonly direction = input<'horizontal' | 'vertical'>('horizontal');

  readonly id = uniqueId();

  private overlayDiv?: HTMLDivElement;

  constructor() {
    effect(() => {
      const panels = this.panels();

      untracked(() => {
        // set the index of each panel first before initializing the drag
        panels.forEach((panel, index) => {
          panel.index = index;
        });
        panels.forEach((panel, index) => {
          // hide the last panel's drag handle
          panel.draggable.set(index !== panels.length - 1);
          if (panel.size() !== 'auto') {
            panel.handleDrag();
          }
        });
        // we need to called setAuto after all panels have been initialized
        // because the number of panels could have changed
        this.setAuto();
      });
    });
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
      auto.lSize.set(str);
      auto.handleDrag();
    }
  }

  start() {
    const div = this.document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = '0';
    div.style.left = '0';
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.zIndex = '9999';
    div.style.cursor = 'ew-resize';
    this.document.body.appendChild(div);
    this.overlayDiv = div;

    this.panels().forEach(panel => {
      panel.onStart();
    });
  }

  end() {
    this.overlayDiv?.remove();
    this.panels().forEach(panel => {
      panel.onEnd();
    });
  }
}

export function aliasResizableGroup(resizableGroup: typeof NgbResizableGroup) {
  return { provide: NgbResizableGroup, useExisting: resizableGroup };
}
