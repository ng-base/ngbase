import { Component, ElementRef, TemplateRef, viewChild } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@ngbase/adk/test';
import { NgbPopover, NgbPopoverMain, NgbPopoverBackdrop, aliasPopover } from './popover';
import { ngbPopoverPortal, registerNgbPopover } from './popover.service';

@Component({
  selector: 'ngb-popover',
  imports: [NgbPopoverMain, NgbPopoverBackdrop],
  providers: [aliasPopover(TestPopover)],
  template: ` <div ngbPopoverMain>
      <ng-container #myDialog />
    </div>
    @if (options().backdrop) {
      <div ngbPopoverBackdrop class="popover-backdrop"></div>
    }
    <ng-template #pop>pop</ng-template>`,
})
class TestPopover extends NgbPopover {}

export function testRegisterPopover() {
  return registerNgbPopover(TestPopover);
}

@Component({
  template: `<div #target></div>
    <ng-template #pop>pop</ng-template>`,
  providers: [testRegisterPopover()],
})
class TestComponent {
  readonly target = viewChild.required<ElementRef<HTMLElement>>('target');
  readonly pop = viewChild.required<TemplateRef<any>>('pop');
  readonly service = ngbPopoverPortal();

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
    expect(view.queryRoot('ngb-popover')).toBeFalsy();
    const diaRef = view.host.open();
    await view.whenStable();
    expect(view.queryRoot('ngb-popover')?.textContent).toContain('pop');

    // close
    diaRef.close();
    await view.whenStable();
    expect(view.queryRoot('ngb-popover')).toBeFalsy();
  });
});
