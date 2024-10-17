import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogRef } from '../portal';
import { render, RenderResult } from '../test';
import { SheetContainer } from './sheet';

const options = { title: 'Drawer' };
const mockDialogRef = new DialogRef(
  options,
  () => jest.fn(),
  () => jest.fn(),
  true,
);

describe('DrawerComponent', () => {
  let component: SheetContainer;
  let view: RenderResult<SheetContainer>;

  beforeEach(async () => {
    view = await render(SheetContainer, [
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
