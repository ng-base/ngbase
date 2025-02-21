import { render, RenderResult } from '@ngbase/adk/test';
import { AppComponent } from './app.component';

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
