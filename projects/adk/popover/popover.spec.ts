import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogRef } from '@ngbase/adk/portal';
import { render, RenderResult } from '@ngbase/adk/test';
import { NgbPopover } from './popover';
import { providePopoverArrowTracker } from './popover-arrow.ng';

const options = {
  title: 'Drawer',
  anchor: true,
  target: { offsetWidth: 200, offsetHeight: 100 } as HTMLElement,
};
const mockDialogRef = new DialogRef(
  options,
  () => jest.fn(),
  () => jest.fn(),
  true,
);

describe('DrawerComponent', () => {
  let component: NgbPopover;
  let view: RenderResult<NgbPopover>;

  beforeEach(async () => {
    view = await render(NgbPopover, [
      provideNoopAnimations(),
      providePopoverArrowTracker(),
      { provide: DialogRef, useValue: mockDialogRef },
    ]);
    component = view.host;
    component.setOptions(options);
    // view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
