import { render, RenderResult } from '@ngbase/adk/test';
import { NgbProgress, NgbProgressBar } from './progress';
import { Component, signal } from '@angular/core';

@Component({
  imports: [NgbProgress, NgbProgressBar],
  template: `
    <div id="progress" ngbProgress [value]="value()">
      <div id="progressBar" ngbProgressBar></div>
    </div>
  `,
})
class ProgressTestComponent {
  readonly value = signal<number>(0);
}

describe('ProgressComponent', () => {
  let component: NgbProgress;
  let view: RenderResult<ProgressTestComponent>;

  beforeEach(async () => {
    view = await render(ProgressTestComponent);
    component = view.viewChild(NgbProgress);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(view.$('#progress').css('overflow')).toBe('hidden');
  });

  it('should handle value changes', () => {
    view.host.value.set(50);
    view.detectChanges();
    expect(component.total()).toBe(-50);
    expect(view.$('#progressBar').css('transform')).toBe('translateX(-50%)');
  });

  it('should handle rtl', () => {
    component['dir'].setDirection(true);
    view.host.value.set(50);
    view.detectChanges();
    expect(component.total()).toBe(50);
    expect(view.$('#progressBar').css('transform')).toBe('translateX(50%)');
  });

  describe('aria attributes', () => {
    it('should set aria-valuenow', () => {
      view.host.value.set(60);
      view.detectChanges();
      expect(view.$('#progress').attr('aria-valuenow')).toBe('60');
    });
  });
});
