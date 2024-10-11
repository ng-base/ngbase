import { render, RenderResult } from '../test';
import { List } from './list.component';

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
