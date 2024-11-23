import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogRef } from '@meeui/ui/portal';
import { render, RenderResult } from '@meeui/adk/test';
import { DrawerContainer } from './drawer';

const options = { title: 'Drawer' };
const mockDialogRef = new DialogRef(
  options,
  () => jest.fn(),
  () => jest.fn(),
  true,
);

describe('DrawerComponent', () => {
  let component: DrawerContainer;
  let view: RenderResult<DrawerContainer>;

  beforeEach(async () => {
    view = await render(DrawerContainer, [
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
