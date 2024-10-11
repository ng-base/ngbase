import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogRef } from '../portal';
import { render, RenderResult } from '../test';
import { Popover } from './popover.component';

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
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
