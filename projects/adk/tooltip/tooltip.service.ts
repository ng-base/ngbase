import { ComponentRef, Injectable, Type } from '@angular/core';
import { basePortal, DialogInput } from '@ngbase/adk/portal';
import { PopoverPosition } from '@ngbase/adk/popover';
import { NgbTooltipTemplate } from './tooltip';

@Injectable({ providedIn: 'root' })
export class TooltipService {
  tooltip = tooltipPortal();
  tooltipOpen: TooltipOpen | undefined;
  private position?: PopoverPosition;
  private timeoutId: any;
  delay = 100;

  insert(
    el: HTMLElement,
    content: string,
    position: PopoverPosition,
    hide: VoidFunction,
    component?: Type<NgbTooltipTemplate>,
  ) {
    clearTimeout(this.timeoutId);
    // destroy immediately if position is different
    if (this.position && this.position !== position) this.destroy(true);

    // update if tooltip is open
    if (this.tooltipOpen) {
      this.tooltipOpen.parent.instance.update(content, el, position, hide);
    } else {
      this.tooltipOpen = this.tooltip.open(content, el, position, hide, component);
    }
    this.position = position;
  }

  destroy = (force?: boolean) => {
    if (force) {
      this.close();
    } else {
      this.timeoutId = setTimeout(() => this.close(), this.delay ?? 100);
    }
  };

  private close() {
    this.tooltipOpen?.destroy();
    this.tooltipOpen = undefined;
    this.delay = 100;
  }
}

interface TooltipOpen {
  destroy: VoidFunction;
  parent: ComponentRef<NgbTooltipTemplate>;
  replace: ((component: DialogInput<NgbTooltipTemplate>) => void) | undefined;
}

export function tooltipPortal() {
  const NAME = 'tooltip';
  const base = basePortal(NAME, NgbTooltipTemplate);

  function open(
    content: string,
    target: HTMLElement,
    position: PopoverPosition,
    hide: VoidFunction,
    parentComponent?: Type<NgbTooltipTemplate>,
  ) {
    const { diaRef, parent, replace } = base.open<NgbTooltipTemplate>(
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
