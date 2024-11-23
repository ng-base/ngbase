import { render, RenderResult } from '@meeui/adk/test';
import { Separator } from './separator';

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
