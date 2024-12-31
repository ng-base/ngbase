import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@meeui/adk/test';
import { DialogRef } from '@meeui/adk/portal';
import { MeeDialogContainer } from './dialog';

const options = { title: 'Drawer' };
const mockDialogRef = new DialogRef(options, jest.fn(), jest.fn(), true);

describe('DrawerComponent', () => {
  let component: MeeDialogContainer;
  let view: RenderResult<MeeDialogContainer>;

  beforeEach(async () => {
    view = await render(MeeDialogContainer, [
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
