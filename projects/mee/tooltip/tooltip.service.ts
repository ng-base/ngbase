import { ComponentRef, Injectable } from '@angular/core';
import { basePortal, DialogInput } from '@meeui/adk/portal';
import { PopoverPosition } from '@meeui/adk/popover';
import { TooltipComponent } from './tooltip';

@Injectable({ providedIn: 'root' })
export class TooltipService {
  tooltip = tooltipPortal();
  tooltipOpen: TooltipOpen | undefined;
  timeoutId: any;
  delay = 100;

  insert(el: HTMLElement, content: string, position: PopoverPosition, hide: VoidFunction) {
    clearTimeout(this.timeoutId);
    if (this.tooltipOpen) {
      this.tooltipOpen.parent.instance.update(content, el, position, hide);
      // setTimeout(() => {
      //   this.tooltipOpen.parent.instance.setPosition(el);
      // });
    } else {
      this.tooltipOpen = this.tooltip.open(content, el, position, hide);
    }
  }

  destroy = () => {
    this.timeoutId = setTimeout(() => {
      this.tooltipOpen?.destroy();
      this.tooltipOpen = undefined;
      this.delay = 100;
    }, this.delay ?? 100);
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

  function open(
    content: string,
    target: HTMLElement,
    position: PopoverPosition,
    hide: VoidFunction,
  ) {
    const { diaRef, parent, replace } = base.open<TooltipComponent>(
      undefined,
      comp => {
        comp.instance.update(content, target, position || 'top', hide);
      },
      undefined,
      false,
    );

    function destroy() {
      diaRef.close();
    }

    return { destroy, parent, replace } as TooltipOpen;
  }

  return { open };
}
