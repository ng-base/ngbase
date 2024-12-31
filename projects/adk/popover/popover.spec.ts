import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogRef } from '@meeui/adk/portal';
import { render, RenderResult } from '@meeui/adk/test';
import { MeePopover } from './popover';

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
  let component: MeePopover;
  let view: RenderResult<MeePopover>;

  beforeEach(async () => {
    view = await render(MeePopover, [
      provideNoopAnimations(),
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
