import { render, RenderResult } from '../test';
import { TypographyComponent } from './typography.component';

describe('TypographyComponent', () => {
  let component: TypographyComponent;
  let view: RenderResult<TypographyComponent>;

  beforeEach(async () => {
    view = await render(TypographyComponent);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
