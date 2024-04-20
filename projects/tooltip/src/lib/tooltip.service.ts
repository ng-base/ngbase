import { inject, Injector } from '@angular/core';
import { PortalService } from '../../../portal/src/lib/portal.service';
import { TooltipComponent } from './tooltip.component';

export function tooltipPortal() {
  const NAME = 'tooltip';
  const dom = inject(PortalService);
  const injector = inject(Injector);

  function open(content: string, target: HTMLElement) {
    const d = TooltipComponent;
    const parent = dom.createComponent(d, injector, NAME);
    parent.instance.content = content;
    parent.instance.target = target;

    function destroy() {
      dom.deleteComponent(NAME, parent);
    }

    return { destroy, parent };
  }

  return { open };
}
