import { render, RenderResult } from '@meeui/ui/test';
import { List } from './list';

describe('ListComponent', () => {
  let component: List;
  let view: RenderResult<List>;

  beforeEach(async () => {
    view = await render(List);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
