import { basePortal } from '@meeui/portal';
import { Sonner } from './sonner.component';

export function sonnerPortal() {
  const NAME = 'sonner';
  const base = basePortal(NAME, Sonner);

  function open<T>() {
    const { parent } = base.open();
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
