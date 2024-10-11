import { render, RenderResult } from '../test';
import { Toggle } from './toggle.component';

describe('ToggleComponent', () => {
  let component: Toggle;
  let view: RenderResult<Toggle>;

  beforeEach(async () => {
    view = await render(Toggle);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
