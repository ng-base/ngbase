import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { render, RenderResult } from '@ngbase/adk/test';
import { DialogRef } from '@ngbase/adk/portal';
import { NgbDialogContainer } from './dialog';

const options = { title: 'Drawer' };
const mockDialogRef = new DialogRef(options, jest.fn(), jest.fn(), true);

describe('DrawerComponent', () => {
  let component: NgbDialogContainer;
  let view: RenderResult<NgbDialogContainer>;

  beforeEach(async () => {
    view = await render(NgbDialogContainer, [
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
