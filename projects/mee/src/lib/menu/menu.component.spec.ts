import { render, RenderResult } from '../test';
import { Menu } from './menu.component';

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
