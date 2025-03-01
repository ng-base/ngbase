import { Component } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ElementHelper, render, RenderResult } from '@ngbase/adk/test';
import { NgbHoverCard } from './hover-card';
import { testRegisterPopover } from '../popover/popover.service.spec';

describe('HoverCard Directive', () => {
  let view: RenderResult<TestComponent>;
  let element: ElementHelper<HTMLElement>;
  let directive: NgbHoverCard;

  @Component({
    imports: [NgbHoverCard],
    template: `
      <button [ngbHoverCard]="hoverCard" delay="1">Hover me</button>
      <ng-template #hoverCard>
        <div>Hover Card</div>
      </ng-template>
    `,
  })
  class TestComponent {}

  beforeEach(async () => {
    view = await render(TestComponent, [provideNoopAnimations(), testRegisterPopover()]);

    element = view.$('button');
    directive = view.viewChild(NgbHoverCard);
  });

  async function mouseEnter(skipTimer = false) {
    element.mouseEnter();
    view.detectChanges();
    if (skipTimer) return;
    await view.sleep(1);
    view.detectChanges();
  }

  async function mouseLeave(skipTimer = false) {
    element.mouseLeave();
    if (skipTimer) return;
    await view.sleep(1);
    await view.whenStable();
  }

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  // TODO: fix this
  xit('should open and close the hover card', async () => {
    await mouseEnter();
    expect(document.body.textContent).toContain('Hover Card');

    await mouseLeave();
    await view.whenStable();
    await view.sleep(2);
    expect(document.body.textContent).not.toContain('Hover Card');
  }, 1000000);

  it('should not open the popup if the mouse leaves before the delay', async () => {
    await mouseEnter(true);
    await mouseLeave();
    expect(directive['outTimer']).toBeFalsy();
    expect(document.body.textContent).not.toContain('Hover Card');
    await mouseEnter();
    expect(document.body.textContent).toContain('Hover Card');
  });

  it('should not close the popup if the mouse enters before the delay', async () => {
    await mouseEnter();
    await mouseLeave(true);
    expect(directive['outTimer']).toBeTruthy();
    await mouseEnter();
    expect(directive['inTimer']).toBeFalsy();
    expect(directive['outTimer']).toBeFalsy();
    expect(document.body.textContent).toContain('Hover Card');
  });
});
