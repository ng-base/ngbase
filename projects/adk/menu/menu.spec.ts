import { render, RenderResult } from '@meeui/adk/test';
import { MeeMenu } from './menu';

describe('MenuComponent', () => {
  let component: MeeMenu;
  let view: RenderResult<MeeMenu>;

  beforeEach(async () => {
    view = await render(MeeMenu);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
