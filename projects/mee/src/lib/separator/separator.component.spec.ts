import { render, RenderResult } from '../test';
import { Separator } from './separator.component';

describe('SeparatorComponent', () => {
  let component: Separator;
  let view: RenderResult<Separator>;

  beforeEach(async () => {
    view = await render(Separator);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
