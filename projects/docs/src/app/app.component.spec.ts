import { AppComponent } from './app.component';
import { render, RenderResult } from '@meeui/ui/test';

describe('AppComponent', () => {
  let component: AppComponent;
  let view: RenderResult<AppComponent>;

  beforeEach(async () => {
    view = await render(AppComponent);
    component = view.host;
    view.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
