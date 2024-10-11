import { render, RenderResult } from '../test';
import { DragComponent } from './drag.component';

describe('DragComponent', () => {
  let component: DragComponent;
  let view: RenderResult<DragComponent>;

  beforeEach(async () => {
    view = await render(DragComponent);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
