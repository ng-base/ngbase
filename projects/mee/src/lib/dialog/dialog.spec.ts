import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogRef } from '../portal';
import { render, RenderResult } from '../test';
import { DialogContainer } from './dialog';

const options = { title: 'Drawer' };
const mockDialogRef = new DialogRef(options, jest.fn(), jest.fn(), true);

describe('DrawerComponent', () => {
  let component: DialogContainer;
  let view: RenderResult<DialogContainer>;

  beforeEach(async () => {
    view = await render(DialogContainer, [
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
