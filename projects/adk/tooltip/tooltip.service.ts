import { ComponentRef, Injectable, Type } from '@angular/core';
import { basePortal, DialogInput } from '@meeui/adk/portal';
import { PopoverPosition } from '@meeui/adk/popover';
import { MeeTooltipTemplate } from './tooltip';

@Injectable({ providedIn: 'root' })
export class TooltipService {
  tooltip = tooltipPortal();
  tooltipOpen: TooltipOpen | undefined;
  timeoutId: any;
  delay = 100;

  insert(
    el: HTMLElement,
    content: string,
    position: PopoverPosition,
    hide: VoidFunction,
    component?: Type<MeeTooltipTemplate>,
  ) {
    clearTimeout(this.timeoutId);
    if (this.tooltipOpen) {
      this.tooltipOpen.parent.instance.update(content, el, position, hide);
      // setTimeout(() => {
      //   this.tooltipOpen.parent.instance.setPosition(el);
      // });
    } else {
      this.tooltipOpen = this.tooltip.open(content, el, position, hide, component);
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
  parent: ComponentRef<MeeTooltipTemplate>;
  replace: ((component: DialogInput<MeeTooltipTemplate>) => void) | undefined;
}

export function tooltipPortal() {
  const NAME = 'tooltip';
  const base = basePortal(NAME, MeeTooltipTemplate);

  function open(
    content: string,
    target: HTMLElement,
    position: PopoverPosition,
    hide: VoidFunction,
    parentComponent?: Type<MeeTooltipTemplate>,
  ) {
    const { diaRef, parent, replace } = base.open<MeeTooltipTemplate>(
      undefined,
      comp => {
        comp.instance.update(content, target, position || 'top', hide);
      },
      undefined,
      false,
      parentComponent,
    );

    function destroy() {
      diaRef.close();
    }

    return { destroy, parent, replace } as TooltipOpen;
  }

  return { open };
}
