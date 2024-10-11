import { render, RenderResult } from '../test';
import { Progress } from './progress.component';

describe('ProgressComponent', () => {
  let component: Progress;
  let view: RenderResult<Progress>;

  beforeEach(async () => {
    view = await render(Progress);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle value changes', () => {
    view.setInput('value', 50);
    view.detectChanges();
    expect(component.total()).toBe(50);
    expect(view.$('div').style.transform).toBe('translateX(-50%)');
  });

  describe('aria attributes', () => {
    it('should set aria-valuenow', () => {
      view.setInput('value', 60);
      view.detectChanges();
      expect(view.fixture.nativeElement.getAttribute('aria-valuenow')).toBe('60');
    });
  });
});
