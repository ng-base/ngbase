import { render, RenderResult } from '../test';
import { Button } from './button.component';

describe('ButtonComponent', () => {
  let component: Button;
  let view: RenderResult<Button>;

  beforeEach(async () => {
    view = await render(Button);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
