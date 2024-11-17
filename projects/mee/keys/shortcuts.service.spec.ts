import { Component } from '@angular/core';
import { RenderResult, injectService, render } from '@meeui/ui/test';
import { uniqueId } from '@meeui/ui/utils';
import { Shortcuts, keyMap } from './shortcuts.service';

interface ComboOptions {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  element?: HTMLElement;
}

describe('Shortcuts', () => {
  let service: Shortcuts;

  beforeEach(() => {
    service = injectService(Shortcuts);
  });

  function simulateKeyPress(
    key: string,
    {
      ctrl = false,
      alt = false,
      shift = false,
      meta = false,
      element = document.createElement('div'),
    }: ComboOptions,
  ) {
    const event = new KeyboardEvent('keydown', {
      key,
      ctrlKey: ctrl,
      altKey: alt,
      shiftKey: shift,
      metaKey: meta,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'target', { value: element });
    service['handleKeyEvent'](event);
    return event;
  }

  function createCallback() {
    return { id: uniqueId(), stop: false, global: false, prevent: true, callback: jest.fn() };
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a shortcut', () => {
    service.on('ctrl+a', createCallback());
    expect(service['shortcuts'].has('ctrl+a')).toBeTruthy();
  });

  it('should unregister a shortcut', () => {
    const callback = createCallback();
    service.on('ctrl+b', callback);
    service.off('ctrl+b', callback.id);
    expect(service['shortcuts'].has('ctrl+b')).toBeFalsy();
  });

  it('should handle key events', () => {
    const combos: [string, string, ComboOptions][] = [
      ['ctrl+c', 'c', { ctrl: true }],
      ['⌘+c', 'c', { meta: true }],
      ['meta+c', 'c', { meta: true }],
    ];
    for (const [combo, key, options] of combos) {
      const callback = createCallback();
      service.on(combo, callback);

      const event = simulateKeyPress(key, options);

      expect(callback.callback).toHaveBeenCalledWith(event);
    }
  });

  it('should ignore events from specified tags', () => {
    const inputElement = document.createElement('input');
    const event = simulateKeyPress('a', { ctrl: true, element: inputElement });

    expect(event.defaultPrevented).toBeFalsy();
  });

  it('should correctly generate key combo string', () => {
    const event = simulateKeyPress('d', { ctrl: true, alt: true, shift: true });

    expect(service['getKeyCombo'](event)).toBe('ctrl+alt+shift+d');
  });

  it('should parse keys', () => {
    const keyCombo: [string, string[]][] = [
      ['ctrl+k', ['ctrl+k']],
      ['⌘+k', ['meta+k']],
      ['ctrl+k|meta+k', ['ctrl+k', 'meta+k']],
      ['⇧+⌘+P', ['shift+meta+p']],
      ['⌥+⌘+P', ['alt+meta+p']],
      ['⌥+ArrowLeft', ['alt+ArrowLeft']],
    ];

    for (const [key, combo] of keyCombo) {
      const output = service['getParsedKey'](key);
      expect(output).toEqual(combo);
    }
  });

  it('should listen only to one keydown event and handle isActive', () => {
    jest.spyOn(service['keydown'], 'on');

    expect(service['isActive']).toBeFalsy();

    const aCallback = createCallback();
    service.on('ctrl+a', aCallback);
    // we have to spy on off because it's called after `on` fn
    jest.spyOn(service['keydown'], 'off');
    expect(service['isActive']).toBeTruthy();
    expect(service['keydown'].on).toHaveBeenCalledTimes(1);

    const bCallback = createCallback();
    service.on('ctrl+b', bCallback);
    expect(service['isActive']).toBeTruthy();
    expect(service['keydown'].on).toHaveBeenCalledTimes(1);
    expect(service['keydown'].off).not.toHaveBeenCalled();

    service.off('ctrl+a', aCallback.id);
    expect(service['isActive']).toBeTruthy();
    expect(service['keydown'].on).toHaveBeenCalledTimes(1);
    expect(service['keydown'].off).not.toHaveBeenCalled();

    service.off('ctrl+b', bCallback.id);
    expect(service['isActive']).toBeFalsy();
    expect(service['keydown'].on).toHaveBeenCalledTimes(1);
    expect(service['keydown'].off).toHaveBeenCalledTimes(1);
  });
});

describe('keyMap', () => {
  let shortcuts: Shortcuts;
  let view: RenderResult<TestComponent>;

  @Component({
    template: '',
  })
  class TestComponent {
    constructor() {
      keyMap('ctrl+e', () => {});
    }
  }

  beforeEach(async () => {
    view = await render(TestComponent);
    shortcuts = injectService(Shortcuts);
  });

  it('should register and unregister a shortcut', () => {
    view.detectChanges();

    expect(shortcuts['shortcuts'].has('ctrl+e')).toBeTruthy();

    view.fixture.destroy();

    expect(shortcuts['shortcuts'].has('ctrl+e')).toBeFalsy();
  });
});
