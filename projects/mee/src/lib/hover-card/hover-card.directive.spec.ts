import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HoverCard } from './hover-card.directive';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

jest.useFakeTimers();

describe('HoverCard Directive', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;
  let directive: HoverCard;

  @Component({
    standalone: true,
    imports: [HoverCard],
    template: `
      <button [meeHoverCard]="hoverCard">Hover me</button>
      <ng-template #hoverCard>
        <div>Hover Card</div>
      </ng-template>
    `,
  })
  class TestComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement.querySelector('button');
    directive = fixture.debugElement.query(By.directive(HoverCard)).injector.get(HoverCard);
  });

  function mouseEnter(skipTimer = false) {
    element.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    if (skipTimer) return;
    // run the intimer
    jest.runOnlyPendingTimers();
    // used to trigger CD in popover
    fixture.detectChanges();
  }

  function mouseLeave(skipTimer = false) {
    element.dispatchEvent(new Event('mouseleave'));
    if (skipTimer) return;
    // run the outTimer
    jest.runOnlyPendingTimers();
    // used to trigger CD in popover to close (reason unknown)
    jest.runOnlyPendingTimers();
    fixture.detectChanges();
  }

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should open and close the hover card', () => {
    mouseEnter();
    expect(document.body.textContent).toContain('Hover Card');

    mouseLeave();
    expect(document.body.textContent).not.toContain('Hover Card');
  });

  it('should not open the popup if the mouse leaves before the delay', () => {
    mouseEnter(true);
    mouseLeave();
    expect(directive.outTimer).toBeFalsy();
    expect(document.body.textContent).not.toContain('Hover Card');
    mouseEnter();
    expect(document.body.textContent).toContain('Hover Card');
  });

  it('should not close the popup if the mouse enters before the delay', () => {
    mouseEnter();
    mouseLeave(true);
    expect(directive.outTimer).toBeTruthy();
    mouseEnter();
    expect(directive.inTimer).toBeFalsy();
    expect(directive.outTimer).toBeFalsy();
    expect(document.body.textContent).toContain('Hover Card');
  });
});
