import { signal } from '@angular/core';
import { render, RenderResult } from '@meeui/ui/test';
import { Radio } from './radio';
import { RadioGroup } from './radio-group';

describe('RadioComponent', () => {
  let component: Radio;
  let view: RenderResult<Radio>;

  beforeEach(async () => {
    view = await render(Radio, [
      { provide: RadioGroup, useValue: { value: signal('1'), updateValue: () => {} } },
    ]);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a unique id', () => {
    expect(component.inputId).toBeTruthy();
  });

  it('should check if value is equal to radio value', () => {
    expect(component.checked()).toBeFalsy();
    view.setInput('value', '1');
    view.detectChanges();
    expect(component.checked()).toBeTruthy();
  });

  it('should call updateValue when clicked', () => {
    view.setInput('value', '1');
    const spy = jest.spyOn(component, 'updateValue');
    view.$('button').click();
    view.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call updateValue when disabled', () => {
    view.setInput('disabled', true);
    const spy = jest.spyOn(component, 'updateValue');
    view.$('button').click();
    view.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should avoid the curosor pointer when disabled', () => {
    view.setInput('disabled', true);
    view.detectChanges();
    const button = view.fixture.nativeElement as HTMLButtonElement;
    expect(button.classList).toContain('cursor-not-allowed');
  });
});
