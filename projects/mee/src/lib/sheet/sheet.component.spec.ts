import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogRef } from '../portal';
import { render, RenderResult } from '../test';
import { Sheet } from './sheet.component';

const options = { title: 'Drawer' };
const mockDialogRef = new DialogRef(
  options,
  () => jest.fn(),
  () => jest.fn(),
  true,
);

describe('DrawerComponent', () => {
  let component: Sheet;
  let view: RenderResult<Sheet>;

  beforeEach(async () => {
    view = await render(Sheet, [
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
