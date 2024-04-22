import { TooltipComponent } from './tooltip.component';
import { DialogPosition, basePortal } from '@meeui/portal';

export function tooltipPortal() {
  const NAME = 'tooltip';
  const base = basePortal(NAME, TooltipComponent);

  function open(
    content: string,
    target: HTMLElement,
    position?: DialogPosition,
  ) {
    const { diaRef, parent } = base.open(undefined, (comp) => {
      comp.instance.content = content;
      comp.instance.target = target;
      comp.instance.position = position || 'top';
    });

    function destroy() {
      diaRef.close();
    }

    return { destroy, parent };
  }

  return { open };
}
