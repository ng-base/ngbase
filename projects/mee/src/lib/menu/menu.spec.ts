import { render, RenderResult } from '@meeui/ui/test';
import { Menu } from './menu';

describe('MenuComponent', () => {
  let component: Menu;
  let view: RenderResult<Menu>;

  beforeEach(async () => {
    view = await render(Menu);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
