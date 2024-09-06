import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AccessibleGroup } from './accessiblity-group.directive';
import { AccessibleItem } from './accessiblity-item.directive';
import { AccessiblityService } from './accessiblity.service';

Element.prototype.scrollIntoView = jest.fn();

@Component({
  template: `
    <div class="parent">
      <div
        meeAccessibleGroup
        [ayId]="groupId"
        [columns]="columns"
        [isPopup]="isPopup"
        [disabled]="isDisabled"
      >
        <button meeAccessibleItem [ayId]="groupId">Item 1</button>
        <button meeAccessibleItem [ayId]="groupId">Item 2</button>
        <button meeAccessibleItem [ayId]="groupId" [disabled]="true">Item 3</button>
        <button meeAccessibleItem [ayId]="groupId">Item 4</button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [AccessibleGroup, AccessibleItem],
})
class TestComponent {
  groupId = 'test-group';
  columns = 2;
  isPopup = false;
  isDisabled = false;
}

describe('AccessibleGroup', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let groupElement: DebugElement;
  let itemElements: DebugElement[];
  let accessibilityService: AccessiblityService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [AccessiblityService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    accessibilityService = TestBed.inject(AccessiblityService);
    fixture.detectChanges();

    groupElement = fixture.debugElement.query(By.directive(AccessibleGroup));
    itemElements = fixture.debugElement.queryAll(By.directive(AccessibleItem));
  });

  //   function itemElements() {
  //     return fixture.debugElement.queryAll(By.directive(AccessibleItem));
  //   }

  function pressKey(key: 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown') {
    document.dispatchEvent(new KeyboardEvent('keydown', { key }));
    // tick();
    fixture.detectChanges();
  }

  function focusElement(el: DebugElement) {
    el.nativeElement.focus();
    // tick();
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(groupElement).toBeTruthy();
    expect(itemElements.length).toBe(4);
  });

  it('should set correct attributes on the group element', () => {
    expect(groupElement.attributes['role']).toBe('group');
    expect(groupElement.attributes['tabindex']).toBe('0');
  });

  it('should register items with AccessibilityService', () => {
    const items = accessibilityService.items('test-group');
    expect(items.length).toBe(4);
  });

  //   it('should handle focus events correctly', fakeAsync(() => {
  //     const groupInstance = groupElement.injector.get(AccessibleGroup);
  //     jest.spyOn(groupInstance, 'on');
  //     jest.spyOn(groupInstance, 'off');

  //     focusElement(groupElement);
  //     expect(groupInstance.on).toHaveBeenCalled();

  //     expect(document.activeElement).toBe(itemElements[0].nativeElement);

  //     focusElement(fixture.debugElement.query(By.css('.parent')));

  //     expect(groupInstance.off).toHaveBeenCalled();
  //   }));

  it('should handle keyboard navigation', () => {
    focusElement(groupElement);
    expect(document.activeElement).toBe(itemElements[0].nativeElement);

    pressKey('ArrowRight');

    expect(document.activeElement).toBe(itemElements[1].nativeElement);

    pressKey('ArrowDown');

    expect(document.activeElement).toBe(itemElements[3].nativeElement);
  });

  it('should skip disabled items during navigation', fakeAsync(() => {
    focusElement(groupElement);

    pressKey('ArrowRight');

    expect(document.activeElement).toBe(itemElements[1].nativeElement);

    pressKey('ArrowRight');

    // Should skip the disabled item (index 2) and move to index 3
    expect(document.activeElement).toBe(itemElements[3].nativeElement);

    pressKey('ArrowRight');

    expect(document.activeElement).toBe(itemElements[0].nativeElement);
  }));

  it('should handle popup mode correctly', fakeAsync(() => {
    component.isPopup = true;
    fixture.detectChanges();

    const groupInstance = groupElement.injector.get(AccessibleGroup);
    groupInstance.on();
    fixture.detectChanges();

    const bodyElements = document.querySelectorAll('body > *');
    bodyElements.forEach(el => {
      if (el.tagName !== 'MEE-PORTAL') {
        expect(el.getAttribute('tabindex')).toBe('-1');
        expect(el.getAttribute('aria-hidden')).toBe('true');
      }
    });

    groupInstance.off();
    fixture.detectChanges();

    bodyElements.forEach(el => {
      expect(el.getAttribute('tabindex')).toBeNull();
      expect(el.getAttribute('aria-hidden')).toBeNull();
    });
  }));

  it('should handle disabled state correctly', () => {
    component.isDisabled = true;
    fixture.detectChanges();

    expect(groupElement.attributes['aria-disabled']).toBe('true');
  });

  // Add more tests as needed...
});
