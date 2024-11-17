import { DestroyRef, inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { documentListener, isClient, uniqueId } from '@meeui/ui/utils';

const IGNORED_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];
const SHORTCUT_MAP: Record<string, string> = {
  '⇧': 'shift',
  '⌥': 'alt',
  '⌃': 'ctrl',
  '⌘': 'meta',
  '⏎': 'enter',
  esc: 'escape',
};

// prettier-ignore
const SPECIAL_KEYS = new Set([
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Enter', 'Escape', 'Tab', 'Backspace', 'Delete',
  'Home', 'End', 'PageUp', 'PageDown',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
]);

interface Shortcut {
  callback: (ev: KeyboardEvent) => void;
  prevent: boolean;
  stop: boolean;
  global: boolean;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class Shortcuts {
  private readonly shortcuts = new Map<string, Shortcut[]>();
  private isActive = false;
  private isClient = isClient();

  on(keyCombination: string, data: Shortcut): void {
    const parsedKey = this.getParsedKey(keyCombination);
    for (const key of parsedKey) {
      const shortcuts = this.shortcuts.get(key) || [];
      shortcuts.push(data);
      this.shortcuts.set(key, shortcuts);
    }
    this.turnOn();
  }

  off(keyCombination: string, id: string): void {
    const parsedKey = this.getParsedKey(keyCombination);
    for (const key of parsedKey) {
      const shortcuts = this.shortcuts.get(key);
      if (shortcuts) {
        const index = shortcuts.findIndex(s => s.id === id);
        if (index > -1) {
          shortcuts.splice(index, 1);
        }
        if (shortcuts.length === 0) {
          this.shortcuts.delete(key);
        }
      }
    }
    this.turnOff();
  }

  /**
   * We need to parse the key combination
   * e.g. ⇧⌘P -> shift+meta+p, ⌥⌘P -> meta+alt+p, ctrl+p -> ctrl+p
   * e.g. esc|prevent|stop|global -> escape
   */
  private getParsedKey(combination: string): string[] {
    const baseSplit = combination.split('|');
    return baseSplit.map(split => {
      const keys = split.split('+');
      const parsedKeys = keys.map(key => {
        // Check if the key is a special character in our map
        if (SHORTCUT_MAP[key]) {
          return SHORTCUT_MAP[key];
        }

        // If it's a special key, return it as is (case-sensitive)
        if (SPECIAL_KEYS.has(key)) {
          return key;
        }
        // If not found in the map or special keys, return the lowercase key
        return key.toLowerCase();
      });
      return parsedKeys.join('+');
    });
  }

  private handleKeyEvent = (event: KeyboardEvent): void => {
    const key = this.getKeyCombo(event);
    const data = this.shortcuts.get(key);
    if (!data) {
      return;
    }
    let i = data.length;
    while (i--) {
      const item = data[i];
      if (item.global && this.shouldIgnoreEvent(event)) {
        return;
      }

      if (item.callback) {
        if (item.prevent) {
          event.preventDefault();
        }
        if (item.stop) {
          event.stopPropagation();
        }
        item.callback(event);
        if (item.stop) {
          break;
        }
      }
    }
  };
  private keydown = documentListener('keydown', this.handleKeyEvent, { lazy: true });

  private shouldIgnoreEvent(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement;

    return (
      IGNORED_TAGS.includes(target.tagName) ||
      target.isContentEditable ||
      target.getAttribute('role') === 'textbox'
    );
  }

  private getKeyCombo(event: KeyboardEvent): string {
    const modifiers = [];

    if (event.ctrlKey) modifiers.push('ctrl');
    if (event.altKey) modifiers.push('alt');
    if (event.shiftKey) modifiers.push('shift');
    if (event.metaKey) modifiers.push('meta');

    const key = event.key.toLowerCase();
    return [...modifiers, key].join('+');
  }

  private turnOff() {
    if (this.isClient && this.shortcuts.size === 0 && this.isActive) {
      this.isActive = false;
      this.keydown.off();
    }
  }

  private turnOn() {
    if (this.isClient && this.shortcuts.size > 0 && !this.isActive) {
      this.isActive = true;
      this.keydown.on();
    }
  }
}

export function keyMap(
  key: string,
  callback: (ev: KeyboardEvent) => void,
  data?: {
    injector?: Injector;
    cleanup?: (off: () => void) => void;
    stop?: boolean;
    global?: boolean;
    prevent?: boolean;
  },
) {
  const { injector, cleanup, stop = false, global = false, prevent = true } = data || {};
  return runInInjectionContext(injector || inject(Injector), () => {
    const shortcuts = inject(Shortcuts);
    const onDestroy = inject(DestroyRef);
    const id = uniqueId();

    shortcuts.on(key, { callback, prevent, stop, global, id });

    const off = () => {
      shortcuts.off(key, id);
    };

    onDestroy?.onDestroy(off);
    cleanup?.(off);
    return off;
  });
}
