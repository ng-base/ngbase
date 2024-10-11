import { Component } from '@angular/core';
import { render, RenderResult, injectService } from '../test';
import { Shortcuts, keyMap } from './shortcuts.service';
import { generateId } from '../utils';

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
      element = document.createElement('div'),
    }: { ctrl?: boolean; alt?: boolean; shift?: boolean; element?: HTMLElement },
  ) {
    const event = new KeyboardEvent('keydown', {
      key,
      ctrlKey: ctrl,
      altKey: alt,
      shiftKey: shift,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'target', { value: element });
    service['handleKeyEvent'](event);
    return event;
  }

  function createCallback() {
    return { id: generateId(), stop: false, global: false, prevent: true, callback: jest.fn() };
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
    const callback = createCallback();
    service.on('ctrl+c', callback);

    const event = simulateKeyPress('c', { ctrl: true });

    expect(callback.callback).toHaveBeenCalledWith(event);
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
    const keyCombo = [
      ['ctrl+k', 'ctrl+k'],
      ['⇧+⌘+P', 'shift+meta+p'],
      ['⌥+⌘+P', 'alt+meta+p'],
      ['⌥+ArrowLeft', 'alt+ArrowLeft'],
    ];

    for (const [key, combo] of keyCombo) {
      const output = service['getParsedKey'](key);
      expect(output).toBe(combo);
    }
  });

  it('should listen only to one keydown event and handle isActive', () => {
    jest.spyOn(service['document'], 'addEventListener');
    jest.spyOn(service['document'], 'removeEventListener');

    expect(service['isActive']).toBeFalsy();

    const aCallback = createCallback();
    service.on('ctrl+a', aCallback);
    expect(service['isActive']).toBeTruthy();
    expect(service['document'].addEventListener).toHaveBeenCalledTimes(1);

    const bCallback = createCallback();
    service.on('ctrl+b', bCallback);
    expect(service['isActive']).toBeTruthy();
    expect(service['document'].addEventListener).toHaveBeenCalledTimes(1);
    expect(service['document'].removeEventListener).not.toHaveBeenCalled();

    service.off('ctrl+a', aCallback.id);
    expect(service['isActive']).toBeTruthy();
    expect(service['document'].addEventListener).toHaveBeenCalledTimes(1);
    expect(service['document'].removeEventListener).not.toHaveBeenCalled();

    service.off('ctrl+b', bCallback.id);
    expect(service['isActive']).toBeFalsy();
    expect(service['document'].addEventListener).toHaveBeenCalledTimes(1);
    expect(service['document'].removeEventListener).toHaveBeenCalledTimes(1);
  });
});

describe('keyMap', () => {
  let shortcuts: Shortcuts;
  let view: RenderResult<TestComponent>;

  @Component({
    standalone: true,
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
