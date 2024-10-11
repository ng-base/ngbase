import { render, RenderResult } from '../test';
import { ToggleGroup } from './toggle-group';

describe('ToggleGroupComponent', () => {
  let component: ToggleGroup<any>;
  let view: RenderResult<ToggleGroup<any>>;

  beforeEach(async () => {
    view = await render(ToggleGroup);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
