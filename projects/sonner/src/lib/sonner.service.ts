import { Injector, Type, inject } from '@angular/core';
import { PortalService } from '@meeui/portal';
import { Sonner } from './sonner.component';

export function sonnerPortal() {
  const dom = inject(PortalService);
  const injector = inject(Injector);

  function open<T>() {
    const d = Sonner as Type<Sonner>;
    const parent = dom.createComponent(d, injector, 'sonner');
    return parent.instance;
  }

  const sonner = open();

  function closeAll() {
    sonner.clear();
  }

  function add(name: string, message: string) {
    sonner.addMessage({ name, message });
  }

  return { add, closeAll };
}
