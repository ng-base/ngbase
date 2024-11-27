import { ChangeDetectionStrategy, Component, DebugElement, signal } from '@angular/core';
import { render, RenderResult } from '@meeui/adk/test';
import { AccessibleGroup } from './accessiblity-group';
import { AccessibleItem } from './accessiblity-item';

Element.prototype.scrollIntoView = jest.fn();

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="parent">
      <div
        meeAccessibleGroup
        [ayId]="groupId"
        [columns]="columns()"
        [isPopup]="isPopup()"
        [disabled]="isDisabled()"
      >
        <input type="text" />
        <button meeAccessibleItem [ayId]="groupId">Item 1</button>
        <button meeAccessibleItem [ayId]="groupId">Item 2</button>
        <button meeAccessibleItem [ayId]="groupId" [disabled]="true">Item 3</button>
        <button meeAccessibleItem [ayId]="groupId">Item 4</button>
      </div>
      <button class="outside">Outside</button>
    </div>
  `,
  imports: [AccessibleGroup, AccessibleItem],
})
class TestComponent {
  groupId = 'test-group';
  columns = signal(2);
  isPopup = signal(false);
  isDisabled = signal(false);
}

describe('AccessibleGroup', () => {
  let view: RenderResult<TestComponent>;
  let group: AccessibleGroup;
  let itemElements: DebugElement[];

  beforeEach(async () => {
    view = await render(TestComponent);
    view.detectChanges();

    group = view.viewChild(AccessibleGroup);
    itemElements = view.viewChildrenDebug(AccessibleItem);
  });

  function pressKey(
    key: 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown' | string,
    element?: DebugElement,
  ) {
    const el = element?.nativeElement || document;
    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    view.detectChanges();
  }

  function focusElement(el: DebugElement) {
    el.nativeElement.focus();
    view.detectChanges();
  }

  it('should create', () => {
    expect(view.host).toBeTruthy();
    expect(group).toBeTruthy();
    expect(itemElements.length).toBe(4);
  });

  it('should set correct attributes on the group element', () => {
    const element = view.$0(AccessibleGroup);
    expect(element.attr('role')).toBe('group');
    expect(element.attr('tabindex')).toBe('0');
  });

  it('should register items with Accessibility Group', () => {
    const items = group.elements();
    expect(items.length).toBe(4);
  });

  //   it('should handle focus events correctly', fakeAsync(() => {
  //     const groupInstance = groupElement.injector.get(AccessibleGroup);
  //     jest.spyOn(groupInstance, 'on');
  //     jest.spyOn(groupInstance, 'off');

  //     focusElement(groupElement);
  //     expect(groupInstance.on).toHaveBeenCalled();

  //     expect(document.activeElement).toBe(itemElements[0].nativeElement);

  //     focusElement(queryDebug('.parent', fixture));

  //     expect(groupInstance.off).toHaveBeenCalled();
  //   }));

  it('should handle keyboard navigation', () => {
    focusElement(view.queryNative(AccessibleGroup));
    expect(document.activeElement).toBe(itemElements[0].nativeElement);

    pressKey('ArrowRight');
    expect(document.activeElement).toBe(itemElements[1].nativeElement);

    pressKey('ArrowDown');
    expect(document.activeElement).toBe(itemElements[3].nativeElement);
  });

  it('should skip disabled items during navigation', () => {
    focusElement(view.queryNative(AccessibleGroup));
    pressKey('ArrowRight');
    expect(document.activeElement).toBe(itemElements[1].nativeElement);

    pressKey('ArrowRight');
    // Should skip the disabled item (index 2) and move to index 3
    expect(document.activeElement).toBe(itemElements[3].nativeElement);

    pressKey('ArrowRight');
    expect(document.activeElement).toBe(itemElements[0].nativeElement);
  });

  it('should handle popup mode correctly', async () => {
    view.host.isPopup.set(true);
    view.detectChanges();

    const groupInstance = view.viewChild(AccessibleGroup);
    groupInstance.on();
    await view.whenStable();

    const bodyElements = document.querySelectorAll('body > *');
    bodyElements.forEach(el => {
      if (el.tagName !== 'MEE-PORTAL') {
        expect(el.getAttribute('tabindex')).toBe('-1');
        expect(el.getAttribute('aria-hidden')).toBe('true');
      }
    });

    groupInstance.off();
    await view.whenStable();

    bodyElements.forEach(el => {
      expect(el.getAttribute('tabindex')).toBeNull();
      expect(el.getAttribute('aria-hidden')).toBeNull();
    });
  });

  it('should handle disabled state correctly', () => {
    view.host.isDisabled.set(true);
    view.detectChanges();
    const element = view.$0(AccessibleGroup);
    expect(element.attr('aria-disabled')).toBe('true');
  });

  it('should handle space and arrow keys in input element', () => {
    view.host.isPopup.set(true);
    view.detectChanges();
    const inputElement = view.queryNative('input');
    focusElement(inputElement);

    pressKey(' ', inputElement);
    expect(document.activeElement).toBe(inputElement.nativeElement);

    pressKey('ArrowRight', inputElement);
    expect(document.activeElement).toBe(inputElement.nativeElement);

    pressKey('ArrowLeft', inputElement);
    expect(document.activeElement).toBe(inputElement.nativeElement);
  });

  // Add more tests as needed...
});
