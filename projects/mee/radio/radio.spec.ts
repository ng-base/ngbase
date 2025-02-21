import { signal } from '@angular/core';
import { NgbRadio, NgbRadioGroup } from '@ngbase/adk/radio';
import { render, RenderResult } from '@ngbase/adk/test';
import { Radio } from './radio';

describe('RadioComponent', () => {
  let component: NgbRadio;
  let view: RenderResult<Radio>;

  beforeEach(async () => {
    view = await render(Radio, [
      { provide: NgbRadioGroup, useValue: { value: signal('1'), updateValue: () => {} } },
    ]);
    component = view.injectHost(NgbRadio);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    expect(view.attr('aria-disabled')).toBe('true');
  });
});
