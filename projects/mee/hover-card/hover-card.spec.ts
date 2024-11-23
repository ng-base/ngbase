import { Component } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ElementHelper, render, RenderResult } from '@meeui/adk/test';
import { HoverCard } from './hover-card';

jest.useFakeTimers();

describe('HoverCard Directive', () => {
  let view: RenderResult<TestComponent>;
  let element: ElementHelper<HTMLElement>;
  let directive: HoverCard;

  @Component({
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
    view = await render(TestComponent, [provideNoopAnimations()]);

    element = view.$0('button');
    directive = view.viewChild(HoverCard);
  });

  function mouseEnter(skipTimer = false) {
    element.mouseEnter();
    view.detectChanges();
    if (skipTimer) return;
    // run the intimer
    jest.runOnlyPendingTimers();
    // used to trigger CD in popover
    view.detectChanges();
  }

  function mouseLeave(skipTimer = false) {
    element.mouseLeave();
    if (skipTimer) return;
    // run the outTimer
    jest.runOnlyPendingTimers();
    // used to trigger CD in popover to close (reason unknown)
    jest.runOnlyPendingTimers();
    view.detectChanges();
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
    expect(directive['outTimer']).toBeFalsy();
    expect(document.body.textContent).not.toContain('Hover Card');
    mouseEnter();
    expect(document.body.textContent).toContain('Hover Card');
  });

  it('should not close the popup if the mouse enters before the delay', () => {
    mouseEnter();
    mouseLeave(true);
    expect(directive['outTimer']).toBeTruthy();
    mouseEnter();
    expect(directive['inTimer']).toBeFalsy();
    expect(directive['outTimer']).toBeFalsy();
    expect(document.body.textContent).toContain('Hover Card');
  });
});
