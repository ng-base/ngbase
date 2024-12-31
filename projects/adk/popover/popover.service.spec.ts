import { Component, ElementRef, TemplateRef, viewChild } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@meeui/adk/test';
import { meePopoverPortal } from './popover.service';

@Component({
  template: `<div #target></div>
    <ng-template #pop>pop</ng-template>`,
})
class TestComponent {
  readonly target = viewChild.required<ElementRef<HTMLElement>>('target');
  readonly pop = viewChild.required<TemplateRef<any>>('pop');
  readonly service = meePopoverPortal();

  open() {
    const target = this.target().nativeElement;
    target.getBoundingClientRect = () =>
      ({
        width: 200,
        height: 100,
      }) as DOMRect;

    const { diaRef } = this.service.open(this.pop(), {
      target,
    });
    return diaRef;
  }
}

describe('PopoverService', () => {
  let view: RenderResult<TestComponent>;

  beforeEach(async () => {
    view = await render(TestComponent, [provideNoopAnimations()]);
  });

  it('should create', () => {
    expect(view.host.service).toBeTruthy();
  });

  it('should open', async () => {
    expect(view.queryRoot('mee-popover')).toBeFalsy();
    const diaRef = view.host.open();
    await view.whenStable();
    expect(view.queryRoot('mee-popover')?.textContent).toContain('pop');

    // close
    diaRef.close();
    await view.whenStable();
    expect(view.queryRoot('mee-popover')).toBeFalsy();
  });
});
