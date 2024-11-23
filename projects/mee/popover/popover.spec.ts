import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@meeui/adk/test';
import { DialogRef } from '@meeui/ui/portal';
import { Popover } from './popover';

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
  let component: Popover;
  let view: RenderResult<Popover>;

  beforeEach(async () => {
    view = await render(Popover, [
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
