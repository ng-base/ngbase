import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogRef } from '../portal';
import { render, RenderResult } from '../test';
import { Dialog } from './dialog.component';

const options = { title: 'Drawer' };
const mockDialogRef = new DialogRef(options, jest.fn(), jest.fn(), true);

describe('DrawerComponent', () => {
  let component: Dialog;
  let view: RenderResult<Dialog>;

  beforeEach(async () => {
    view = await render(Dialog, [
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
