import { TooltipComponent } from './tooltip.component';
import { DialogInput, DialogPosition, basePortal } from '../portal';
import { ComponentRef, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TooltipService {
  tooltip = tooltipPortal();
  tooltipOpen: TooltipOpen | undefined;
  timeoutId: any;

  insert(el: HTMLElement, content: string, position: DialogPosition) {
    clearTimeout(this.timeoutId);
    if (this.tooltipOpen) {
      this.tooltipOpen.parent.instance.update(content, el, position);
      // setTimeout(() => {
      //   this.tooltipOpen.parent.instance.setPosition(el);
      // });
    } else {
      this.tooltipOpen = this.tooltip.open(content, el, position);
    }
  }

  destroy = () => {
    this.timeoutId = setTimeout(() => {
      this.tooltipOpen?.destroy();
      this.tooltipOpen = undefined;
    }, 100);
  };
}

interface TooltipOpen {
  destroy: VoidFunction;
  parent: ComponentRef<TooltipComponent>;
  replace: ((component: DialogInput<TooltipComponent>) => void) | undefined;
}

export function tooltipPortal() {
  const NAME = 'tooltip';
  const base = basePortal(NAME, TooltipComponent);

  function open(content: string, target: HTMLElement, position?: DialogPosition) {
    const { diaRef, parent, replace } = base.open<TooltipComponent>(
      undefined,
      comp => {
        comp.instance.content.set(content);
        comp.instance.target = target;
        comp.instance.position = position || 'top';
      },
      undefined,
      false
    );

    function destroy() {
      diaRef.close();
    }

    return { destroy, parent, replace } as TooltipOpen;
  }

  return { open };
}
